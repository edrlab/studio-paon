import {Decoration, EditorView, runScopeHandlers, ViewPlugin} from './view.js';
import {CharCategory, combineConfig, EditorSelection, Facet, Prec, StateEffect, StateField} from './state.js';
import {getPanel, showPanel} from './panel.js';
import {RangeSetBuilder} from './rangeset.js';
import elt from './crelt.js';
import {codePointAt, codePointSize, findClusterBreak, fromCodePoint} from './text.js';

const basicNormalize = typeof String.prototype.normalize == "function"
	? x => x.normalize("NFKD") : x => x;

/**
A search cursor provides an iterator over text matches in a
document.
 */
class SearchCursor {
	/**
    Create a text cursor. The query is the search string, `from` to
    `to` provides the region to search.
    
    When `normalize` is given, it will be called, on both the query
    string and the content it is matched against, before comparing.
    You can, for example, create a case-insensitive search by
    passing `s => s.toLowerCase()`.
    
    Text is always normalized with
    [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    (when supported).
	 */
	constructor(text, query, from = 0, to = text.length, normalize) {
		/**
        The current match (only holds a meaningful value after
        [`next`](https://codemirror.net/6/docs/ref/#search.SearchCursor.next) has been called and when
        `done` is false).
		 */
		this.value = {from: 0, to: 0};
		/**
        Whether the end of the iterated region has been reached.
		 */
		this.done = false;
		this.matches = [];
		this.buffer = "";
		this.bufferPos = 0;
		this.iter = text.iterRange(from, to);
		this.bufferStart = from;
		this.normalize = normalize ? x => normalize(basicNormalize(x)) : basicNormalize;
		this.query = this.normalize(query);
	}

	peek() {
		if (this.bufferPos == this.buffer.length) {
			this.bufferStart += this.buffer.length;
			this.iter.next();
			if (this.iter.done)
				return -1;
			this.bufferPos = 0;
			this.buffer = this.iter.value;
		}
		return codePointAt(this.buffer, this.bufferPos);
	}

	/**
    Look for the next match. Updates the iterator's
    [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
    [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
    at least once before using the cursor.
	 */
	next() {
		while (this.matches.length)
			this.matches.pop();
		return this.nextOverlapping();
	}

	/**
    The `next` method will ignore matches that partially overlap a
    previous match. This method behaves like `next`, but includes
    such matches.
	 */
	nextOverlapping() {
		for (; ;) {
			let next = this.peek();
			if (next < 0) {
				this.done = true;
				return this;
			}
			let str = fromCodePoint(next), start = this.bufferStart + this.bufferPos;
			this.bufferPos += codePointSize(next);
			let norm = this.normalize(str);
			for (let i = 0, pos = start; ; i++) {
				let code = norm.charCodeAt(i);
				let match = this.match(code, pos);
				if (match) {
					this.value = match;
					return this;
				}
				if (i == norm.length - 1)
					break;
				if (pos == start && i < str.length && str.charCodeAt(i) == code)
					pos++;
			}
		}
	}

	match(code, pos) {
		let match = null;
		for (let i = 0; i < this.matches.length; i += 2) {
			let index = this.matches[i], keep = false;
			if (this.query.charCodeAt(index) == code) {
				if (index == this.query.length - 1) {
					match = {from: this.matches[i + 1], to: pos + 1};
				} else {
					this.matches[i]++;
					keep = true;
				}
			}
			if (!keep) {
				this.matches.splice(i, 2);
				i -= 2;
			}
		}
		if (this.query.charCodeAt(0) == code) {
			if (this.query.length == 1)
				match = {from: pos, to: pos + 1};
			else
				this.matches.push(1, pos);
		}
		return match;
	}
}

const empty = {from: -1, to: -1, match: /.*/.exec("")};
const baseFlags = "gm" + (/x/.unicode == null ? "" : "u");

class RegExpCursor {
	constructor(text, query, options, from = 0, to = text.length) {
		this.to = to;
		this.curLine = "";
		this.done = false;
		this.value = empty;
		if (/\\[sWDnr]|\n|\r|\[\^/.test(query))
			return new MultilineRegExpCursor(text, query, options, from, to);
		this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
		this.iter = text.iter();
		let startLine = text.lineAt(from);
		this.curLineStart = startLine.from;
		this.matchPos = from;
		this.getLine(this.curLineStart);
	}

	getLine(skip) {
		this.iter.next(skip);
		if (this.iter.lineBreak) {
			this.curLine = "";
		} else {
			this.curLine = this.iter.value;
			if (this.curLineStart + this.curLine.length > this.to)
				this.curLine = this.curLine.slice(0, this.to - this.curLineStart);
			this.iter.next();
		}
	}

	nextLine() {
		this.curLineStart = this.curLineStart + this.curLine.length + 1;
		if (this.curLineStart > this.to)
			this.curLine = "";
		else
			this.getLine(0);
	}

	next() {
		for (let off = this.matchPos - this.curLineStart; ;) {
			this.re.lastIndex = off;
			let match = this.matchPos <= this.to && this.re.exec(this.curLine);
			if (match) {
				let from = this.curLineStart + match.index, to = from + match[0].length;
				this.matchPos = to + (from == to ? 1 : 0);
				if (from == this.curLine.length)
					this.nextLine();
				if (from < to || from > this.value.to) {
					this.value = {from, to, match};
					return this;
				}
				off = this.matchPos - this.curLineStart;
			} else if (this.curLineStart + this.curLine.length < this.to) {
				this.nextLine();
				off = 0;
			} else {
				this.done = true;
				return this;
			}
		}
	}
}

const flattened = new WeakMap();

// Reusable (partially) flattened document strings
class FlattenedDoc {
	constructor(from, text) {
		this.from = from;
		this.text = text;
	}

	get to() { return this.from + this.text.length; }

	static get(doc, from, to) {
		let cached = flattened.get(doc);
		if (!cached || cached.from >= to || cached.to <= from) {
			let flat = new FlattenedDoc(from, doc.sliceString(from, to));
			flattened.set(doc, flat);
			return flat;
		}
		if (cached.from == from && cached.to == to)
			return cached;
		let {text, from: cachedFrom} = cached;
		if (cachedFrom > from) {
			text = doc.sliceString(from, cachedFrom) + text;
			cachedFrom = from;
		}
		if (cached.to < to)
			text += doc.sliceString(cached.to, to);
		flattened.set(doc, new FlattenedDoc(cachedFrom, text));
		return new FlattenedDoc(from, text.slice(from - cachedFrom, to - cachedFrom));
	}
}

class MultilineRegExpCursor {
	constructor(text, query, options, from, to) {
		this.text = text;
		this.to = to;
		this.done = false;
		this.value = empty;
		this.matchPos = from;
		this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
		this.flat = FlattenedDoc.get(text, from, this.chunkEnd(from + 5000 /* Base */));
	}

	chunkEnd(pos) {
		return pos >= this.to ? this.to : this.text.lineAt(pos).to;
	}

	next() {
		for (; ;) {
			let off = this.re.lastIndex = this.matchPos - this.flat.from;
			let match = this.re.exec(this.flat.text);
			// Skip empty matches directly after the last match
			if (match && !match[0] && match.index == off) {
				this.re.lastIndex = off + 1;
				match = this.re.exec(this.flat.text);
			}
			// If a match goes almost to the end of a noncomplete chunk, try
			// again, since it'll likely be able to match more
			if (match && this.flat.to < this.to && match.index + match[0].length > this.flat.text.length - 10)
				match = null;
			if (match) {
				let from = this.flat.from + match.index, to = from + match[0].length;
				this.value = {from, to, match};
				this.matchPos = to + (from == to ? 1 : 0);
				return this;
			} else {
				if (this.flat.to == this.to) {
					this.done = true;
					return this;
				}
				// Grow the flattened doc
				this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
			}
		}
	}
}

function validRegExp(source) {
	try {
		new RegExp(source, baseFlags);
		return true;
	} catch (_a) {
		return false;
	}
}

function createLineDialog(view) {
	let input = elt("input", {class: "cm-textfield", name: "line"});
	let dom = elt("form", {
		class: "cm-gotoLine",
		onkeydown: (event) => {
			if (event.keyCode == 27) { // Escape
				event.preventDefault();
				view.dispatch({effects: dialogEffect.of(false)});
				view.focus();
			} else if (event.keyCode == 13) { // Enter
				event.preventDefault();
				go();
			}
		},
		onsubmit: (event) => {
			event.preventDefault();
			go();
		}
	}, elt("label", view.state.phrase("Go to line"), ": ", input), " ", elt("button", {class: "cm-button", type: "submit"}, view.state.phrase("go")));

	function go() {
		let match = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(input.value);
		if (!match)
			return;
		let {state} = view, startLine = state.doc.lineAt(state.selection.main.head);
		let [, sign, ln, cl, percent] = match;
		let col = cl ? +cl.slice(1) : 0;
		let line = ln ? +ln : startLine.number;
		if (ln && percent) {
			let pc = line / 100;
			if (sign)
				pc = pc * (sign == "-" ? -1 : 1) + (startLine.number / state.doc.lines);
			line = Math.round(state.doc.lines * pc);
		} else if (ln && sign) {
			line = line * (sign == "-" ? -1 : 1) + startLine.number;
		}
		let docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
		view.dispatch({
			effects: dialogEffect.of(false),
			selection: EditorSelection.cursor(docLine.from + Math.max(0, Math.min(col, docLine.length))),
			scrollIntoView: true
		});
		view.focus();
	}

	return {dom, pos: -10};
}

const dialogEffect = StateEffect.define();
const dialogField = StateField.define({
	create() { return true; },
	update(value, tr) {
		for (let e of tr.effects)
			if (e.is(dialogEffect))
				value = e.value;
		return value;
	},
	provide: f => showPanel.from(f, val => val ? createLineDialog : null)
});
/**
Command that shows a dialog asking the user for a line number, and
when a valid position is provided, moves the cursor to that line.

Supports line numbers, relative line offsets prefixed with `+` or
`-`, document percentages suffixed with `%`, and an optional
column position by adding `:` and a second number after the line
number.

The dialog can be styled with the `panel.gotoLine` theme
selector.
 */
const gotoLine = view => {
	let panel = getPanel(view, createLineDialog);
	if (!panel) {
		let effects = [dialogEffect.of(true)];
		if (view.state.field(dialogField, false) == null)
			effects.push(StateEffect.appendConfig.of([dialogField, baseTheme$1]));
		view.dispatch({effects});
		panel = getPanel(view, createLineDialog);
	}
	if (panel)
		panel.dom.querySelector("input").focus();
	return true;
};
const baseTheme$1 = EditorView.baseTheme({
	".cm-panel.cm-gotoLine": {
		padding: "2px 6px 4px",
		"& label": {fontSize: "80%"}
	}
});

const defaultHighlightOptions = {
	highlightWordAroundCursor: false,
	minSelectionLength: 1,
	maxMatches: 100
};
const highlightConfig = Facet.define({
	combine(options) {
		return combineConfig(options, defaultHighlightOptions, {
			highlightWordAroundCursor: (a, b) => a || b,
			minSelectionLength: Math.min,
			maxMatches: Math.min
		});
	}
});

/**
This extension highlights text that matches the selection. It uses
the `"cm-selectionMatch"` class for the highlighting. When
`highlightWordAroundCursor` is enabled, the word at the cursor
itself will be highlighted with `"cm-selectionMatch-main"`.
 */
function highlightSelectionMatches(options) {
	let ext = [defaultTheme, matchHighlighter];
	if (options)
		ext.push(highlightConfig.of(options));
	return ext;
}

function wordAt(doc, pos, check) {
	let line = doc.lineAt(pos);
	let from = pos - line.from, to = pos - line.from;
	while (from > 0) {
		let prev = findClusterBreak(line.text, from, false);
		if (check(line.text.slice(prev, from)) != CharCategory.Word)
			break;
		from = prev;
	}
	while (to < line.length) {
		let next = findClusterBreak(line.text, to);
		if (check(line.text.slice(to, next)) != CharCategory.Word)
			break;
		to = next;
	}
	return from == to ? null : line.text.slice(from, to);
}

const matchDeco = Decoration.mark({class: "cm-selectionMatch"});
const mainMatchDeco = Decoration.mark({class: "cm-selectionMatch cm-selectionMatch-main"});
const matchHighlighter = ViewPlugin.fromClass(class {
	constructor(view) {
		this.decorations = this.getDeco(view);
	}

	update(update) {
		if (update.selectionSet || update.docChanged || update.viewportChanged)
			this.decorations = this.getDeco(update.view);
	}

	getDeco(view) {
		let conf = view.state.facet(highlightConfig);
		let {state} = view, sel = state.selection;
		if (sel.ranges.length > 1)
			return Decoration.none;
		let range = sel.main, query, check = null;
		if (range.empty) {
			if (!conf.highlightWordAroundCursor)
				return Decoration.none;
			check = state.charCategorizer(range.head);
			query = wordAt(state.doc, range.head, check);
			if (!query)
				return Decoration.none;
		} else {
			let len = range.to - range.from;
			if (len < conf.minSelectionLength || len > 200)
				return Decoration.none;
			query = state.sliceDoc(range.from, range.to).trim();
			if (!query)
				return Decoration.none;
		}
		let deco = [];
		for (let part of view.visibleRanges) {
			let cursor = new SearchCursor(state.doc, query, part.from, part.to);
			while (!cursor.nextOverlapping().done) {
				let {from, to} = cursor.value;
				if (!check || ((from == 0 || check(state.sliceDoc(from - 1, from)) != CharCategory.Word) &&
					(to == state.doc.length || check(state.sliceDoc(to, to + 1)) != CharCategory.Word))) {
					if (check && from <= range.from && to >= range.to)
						deco.push(mainMatchDeco.range(from, to));
					else if (from >= range.to || to <= range.from)
						deco.push(matchDeco.range(from, to));
					if (deco.length > conf.maxMatches)
						return Decoration.none;
				}
			}
		}
		return Decoration.set(deco);
	}
}, {
	decorations: v => v.decorations
});
const defaultTheme = EditorView.baseTheme({
	".cm-selectionMatch": {backgroundColor: "#99ff7780"},
	".cm-searchMatch .cm-selectionMatch": {backgroundColor: "transparent"}
});

class Query {
	constructor(search, replace, caseInsensitive) {
		this.search = search;
		this.replace = replace;
		this.caseInsensitive = caseInsensitive;
	}

	eq(other) {
		return this.search == other.search && this.replace == other.replace &&
			this.caseInsensitive == other.caseInsensitive && this.constructor == other.constructor;
	}
}

class StringQuery extends Query {
	constructor(search, replace, caseInsensitive) {
		super(search, replace, caseInsensitive);
		this.unquoted = search.replace(/\\([nrt\\])/g, (_, ch) => ch == "n" ? "\n" : ch == "r" ? "\r" : ch == "t" ? "\t" : "\\");
	}

	cursor(doc, from = 0, to = doc.length) {
		return new SearchCursor(doc, this.unquoted, from, to, this.caseInsensitive ? x => x.toLowerCase() : undefined);
	}

	nextMatch(doc, curFrom, curTo) {
		let cursor = this.cursor(doc, curTo).nextOverlapping();
		if (cursor.done)
			cursor = this.cursor(doc, 0, curFrom).nextOverlapping();
		return cursor.done ? null : cursor.value;
	}

	// Searching in reverse is, rather than implementing inverted search
	// cursor, done by scanning chunk after chunk forward.
	prevMatchInRange(doc, from, to) {
		for (let pos = to; ;) {
			let start = Math.max(from, pos - 10000 /* ChunkSize */ - this.unquoted.length);
			let cursor = this.cursor(doc, start, pos), range = null;
			while (!cursor.nextOverlapping().done)
				range = cursor.value;
			if (range)
				return range;
			if (start == from)
				return null;
			pos -= 10000 /* ChunkSize */;
		}
	}

	prevMatch(doc, curFrom, curTo) {
		return this.prevMatchInRange(doc, 0, curFrom) ||
			this.prevMatchInRange(doc, curTo, doc.length);
	}

	getReplacement(_result) { return this.replace; }

	matchAll(doc, limit) {
		let cursor = this.cursor(doc), ranges = [];
		while (!cursor.next().done) {
			if (ranges.length >= limit)
				return null;
			ranges.push(cursor.value);
		}
		return ranges;
	}

	highlight(doc, from, to, add) {
		let cursor = this.cursor(doc, Math.max(0, from - this.unquoted.length), Math.min(to + this.unquoted.length, doc.length));
		while (!cursor.next().done)
			add(cursor.value.from, cursor.value.to);
	}

	get valid() { return !!this.search; }
}

class RegExpQuery extends Query {
	constructor(search, replace, caseInsensitive) {
		super(search, replace, caseInsensitive);
		this.valid = !!search && validRegExp(search);
	}

	cursor(doc, from = 0, to = doc.length) {
		return new RegExpCursor(doc, this.search, this.caseInsensitive ? {ignoreCase: true} : undefined, from, to);
	}

	nextMatch(doc, curFrom, curTo) {
		let cursor = this.cursor(doc, curTo).next();
		if (cursor.done)
			cursor = this.cursor(doc, 0, curFrom).next();
		return cursor.done ? null : cursor.value;
	}

	prevMatchInRange(doc, from, to) {
		for (let size = 1; ; size++) {
			let start = Math.max(from, to - size * 10000 /* ChunkSize */);
			let cursor = this.cursor(doc, start, to), range = null;
			while (!cursor.next().done)
				range = cursor.value;
			if (range && (start == from || range.from > start + 10))
				return range;
			if (start == from)
				return null;
		}
	}

	prevMatch(doc, curFrom, curTo) {
		return this.prevMatchInRange(doc, 0, curFrom) ||
			this.prevMatchInRange(doc, curTo, doc.length);
	}

	getReplacement(result) {
		return this.replace.replace(/\$([$&\d+])/g, (m, i) => i == "$" ? "$"
			: i == "&" ? result.match[0]
				: i != "0" && +i < result.match.length ? result.match[i]
					: m);
	}

	matchAll(doc, limit) {
		let cursor = this.cursor(doc), ranges = [];
		while (!cursor.next().done) {
			if (ranges.length >= limit)
				return null;
			ranges.push(cursor.value);
		}
		return ranges;
	}

	highlight(doc, from, to, add) {
		let cursor = this.cursor(doc, Math.max(0, from - 250 /* HighlightMargin */), Math.min(to + 250 /* HighlightMargin */, doc.length));
		while (!cursor.next().done)
			add(cursor.value.from, cursor.value.to);
	}
}

const setQuery = StateEffect.define();
const togglePanel = StateEffect.define();
const searchState = StateField.define({
	create() {
		return new SearchState(new StringQuery("", "", false), null);
	},
	update(value, tr) {
		for (let effect of tr.effects) {
			if (effect.is(setQuery))
				value = new SearchState(effect.value, value.panel);
			else if (effect.is(togglePanel))
				value = new SearchState(value.query, effect.value ? createSearchPanel : null);
		}
		return value;
	},
	provide: f => showPanel.from(f, val => val.panel)
});

class SearchState {
	constructor(query, panel) {
		this.query = query;
		this.panel = panel;
	}
}

const matchMark = Decoration.mark({class: "cm-searchMatch"}), selectedMatchMark = Decoration.mark({class: "cm-searchMatch cm-searchMatch-selected"});
const searchHighlighter = ViewPlugin.fromClass(class {
	constructor(view) {
		this.view = view;
		this.decorations = this.highlight(view.state.field(searchState));
	}

	update(update) {
		let state = update.state.field(searchState);
		if (state != update.startState.field(searchState) || update.docChanged || update.selectionSet)
			this.decorations = this.highlight(state);
	}

	highlight({query, panel}) {
		if (!panel || !query.valid)
			return Decoration.none;
		let {view} = this;
		let builder = new RangeSetBuilder();
		for (let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i++) {
			let {from, to} = ranges[i];
			while (i < l - 1 && to > ranges[i + 1].from - 2 * 250 /* HighlightMargin */)
				to = ranges[++i].to;
			query.highlight(view.state.doc, from, to, (from, to) => {
				let selected = view.state.selection.ranges.some(r => r.from == from && r.to == to);
				builder.add(from, to, selected ? selectedMatchMark : matchMark);
			});
		}
		return builder.finish();
	}
}, {
	decorations: v => v.decorations
});

function searchCommand(f) {
	return view => {
		let state = view.state.field(searchState, false);
		return state && state.query.valid ? f(view, state) : openSearchPanel(view);
	};
}

/**
Open the search panel if it isn't already open, and move the
selection to the first match after the current main selection.
Will wrap around to the start of the document when it reaches the
end.
 */
const findNext = searchCommand((view, {query}) => {
	let {from, to} = view.state.selection.main;
	let next = query.nextMatch(view.state.doc, from, to);
	if (!next || next.from == from && next.to == to)
		return false;
	view.dispatch({
		selection: {anchor: next.from, head: next.to},
		scrollIntoView: true,
		effects: announceMatch(view, next)
	});
	return true;
});
/**
Move the selection to the previous instance of the search query,
before the current main selection. Will wrap past the start
of the document to start searching at the end again.
 */
const findPrevious = searchCommand((view, {query}) => {
	let {state} = view, {from, to} = state.selection.main;
	let range = query.prevMatch(state.doc, from, to);
	if (!range)
		return false;
	view.dispatch({
		selection: {anchor: range.from, head: range.to},
		scrollIntoView: true,
		effects: announceMatch(view, range)
	});
	return true;
});
/**
Select all instances of the search query.
 */
const selectMatches = searchCommand((view, {query}) => {
	let ranges = query.matchAll(view.state.doc, 1000);
	if (!ranges || !ranges.length)
		return false;
	view.dispatch({
		selection: EditorSelection.create(ranges.map(r => EditorSelection.range(r.from, r.to)))
	});
	return true;
});
/**
Select all instances of the currently selected text.
 */
const selectSelectionMatches = ({state, dispatch}) => {
	let sel = state.selection;
	if (sel.ranges.length > 1 || sel.main.empty)
		return false;
	let {from, to} = sel.main;
	let ranges = [], main = 0;
	for (let cur = new SearchCursor(state.doc, state.sliceDoc(from, to)); !cur.next().done;) {
		if (ranges.length > 1000)
			return false;
		if (cur.value.from == from)
			main = ranges.length;
		ranges.push(EditorSelection.range(cur.value.from, cur.value.to));
	}
	dispatch(state.update({selection: EditorSelection.create(ranges, main)}));
	return true;
};
/**
Replace the current match of the search query.
 */
const replaceNext = searchCommand((view, {query}) => {
	let {state} = view, {from, to} = state.selection.main;
	let next = query.nextMatch(state.doc, from, from);
	if (!next)
		return false;
	let changes = [], selection, replacement;
	if (next.from == from && next.to == to) {
		replacement = state.toText(query.getReplacement(next));
		changes.push({from: next.from, to: next.to, insert: replacement});
		next = query.nextMatch(state.doc, next.from, next.to);
	}
	if (next) {
		let off = changes.length == 0 || changes[0].from >= next.to ? 0 : next.to - next.from - replacement.length;
		selection = {anchor: next.from - off, head: next.to - off};
	}
	view.dispatch({
		changes, selection,
		scrollIntoView: !!selection,
		effects: next ? announceMatch(view, next) : undefined
	});
	return true;
});
/**
Replace all instances of the search query with the given
replacement.
 */
const replaceAll = searchCommand((view, {query}) => {
	let changes = query.matchAll(view.state.doc, 1e9).map(match => {
		let {from, to} = match;
		return {from, to, insert: query.getReplacement(match)};
	});
	if (!changes.length)
		return false;
	view.dispatch({changes});
	return true;
});

function createSearchPanel(view) {
	let {query} = view.state.field(searchState);
	return {
		dom: buildPanel({
			view,
			query,
			updateQuery(q) {
				if (!query.eq(q)) {
					query = q;
					view.dispatch({effects: setQuery.of(query)});
				}
			}
		}),
		mount() {
			this.dom.querySelector("[name=search]").select();
		},
		pos: 80
	};
}

/**
Make sure the search panel is open and focused.
 */
const openSearchPanel = view => {
	let state = view.state.field(searchState, false);
	if (state && state.panel) {
		let panel = getPanel(view, createSearchPanel);
		if (!panel)
			return false;
		panel.dom.querySelector("[name=search]").focus();
	} else {
		view.dispatch({effects: [togglePanel.of(true), ...state ? [] : [StateEffect.appendConfig.of(searchExtensions)]]});
	}
	return true;
};
/**
Close the search panel.
 */
const closeSearchPanel = view => {
	let state = view.state.field(searchState, false);
	if (!state || !state.panel)
		return false;
	let panel = getPanel(view, createSearchPanel);
	if (panel && panel.dom.contains(view.root.activeElement))
		view.focus();
	view.dispatch({effects: togglePanel.of(false)});
	return true;
};
/**
Default search-related key bindings.

 - Mod-f: [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel)
 - F3, Mod-g: [`findNext`](https://codemirror.net/6/docs/ref/#search.findNext)
 - Shift-F3, Shift-Mod-g: [`findPrevious`](https://codemirror.net/6/docs/ref/#search.findPrevious)
 - Alt-g: [`gotoLine`](https://codemirror.net/6/docs/ref/#search.gotoLine)
 */
const searchKeymap = [
	{key: "Mod-f", run: openSearchPanel, scope: "editor search-panel"},
	{key: "F3", run: findNext, shift: findPrevious, scope: "editor search-panel"},
	{key: "Mod-g", run: findNext, shift: findPrevious, scope: "editor search-panel"},
	{key: "Escape", run: closeSearchPanel, scope: "editor search-panel"},
	{key: "Mod-Shift-l", run: selectSelectionMatches},
	{key: "Alt-g", run: gotoLine}
];

function buildPanel(conf) {
	function phrase(phrase) { return conf.view.state.phrase(phrase); }

	let searchField = elt("input", {
		value: conf.query.search,
		placeholder: phrase("Find"),
		"aria-label": phrase("Find"),
		class: "cm-textfield",
		name: "search",
		onchange: update,
		onkeyup: update
	});
	let replaceField = elt("input", {
		value: conf.query.replace,
		placeholder: phrase("Replace"),
		"aria-label": phrase("Replace"),
		class: "cm-textfield",
		name: "replace",
		onchange: update,
		onkeyup: update
	});
	let caseField = elt("input", {
		type: "checkbox",
		name: "case",
		checked: !conf.query.caseInsensitive,
		onchange: update
	});
	let reField = elt("input", {
		type: "checkbox",
		name: "re",
		checked: conf.query instanceof RegExpQuery,
		onchange: update
	});

	function update() {
		conf.updateQuery(new (reField.checked ? RegExpQuery : StringQuery)(searchField.value, replaceField.value, !caseField.checked));
	}

	function keydown(e) {
		if (runScopeHandlers(conf.view, e, "search-panel")) {
			e.preventDefault();
		} else if (e.keyCode == 13 && e.target == searchField) {
			e.preventDefault();
			(e.shiftKey ? findPrevious : findNext)(conf.view);
		} else if (e.keyCode == 13 && e.target == replaceField) {
			e.preventDefault();
			replaceNext(conf.view);
		}
	}

	function button(name, onclick, content) {
		return elt("button", {class: "cm-button", name, onclick}, content);
	}

	let panel = elt("div", {onkeydown: keydown, class: "cm-search"}, [
		searchField,
		button("next", () => findNext(conf.view), [phrase("next")]),
		button("prev", () => findPrevious(conf.view), [phrase("previous")]),
		button("select", () => selectMatches(conf.view), [phrase("all")]),
		elt("label", null, [caseField, phrase("match case")]),
		elt("label", null, [reField, phrase("regexp")]),
		elt("br"),
		replaceField,
		button("replace", () => replaceNext(conf.view), [phrase("replace")]),
		button("replaceAll", () => replaceAll(conf.view), [phrase("replace all")]),
		elt("button", {name: "close", onclick: () => closeSearchPanel(conf.view), "aria-label": phrase("close")}, ["×"])
	]);
	return panel;
}

const AnnounceMargin = 30;
const Break = /[\s\.,:;?!]/;

function announceMatch(view, {from, to}) {
	let lineStart = view.state.doc.lineAt(from).from, lineEnd = view.state.doc.lineAt(to).to;
	let start = Math.max(lineStart, from - AnnounceMargin), end = Math.min(lineEnd, to + AnnounceMargin);
	let text = view.state.sliceDoc(start, end);
	if (start != lineStart) {
		for (let i = 0; i < AnnounceMargin; i++)
			if (!Break.test(text[i + 1]) && Break.test(text[i])) {
				text = text.slice(i);
				break;
			}
	}
	if (end != lineEnd) {
		for (let i = text.length - 1; i > text.length - AnnounceMargin; i--)
			if (!Break.test(text[i - 1]) && Break.test(text[i])) {
				text = text.slice(0, i);
				break;
			}
	}
	return EditorView.announce.of(`${view.state.phrase("current match")}. ${text} ${view.state.phrase("on line")} ${view.state.doc.lineAt(from).number}`);
}

const baseTheme = EditorView.baseTheme({
	".cm-panel.cm-search": {
		padding: "2px 6px 4px",
		position: "relative",
		"& [name=close]": {
			position: "absolute",
			top: "0",
			right: "4px",
			backgroundColor: "inherit",
			border: "none",
			font: "inherit",
			padding: 0,
			margin: 0
		},
		"& input, & button, & label": {
			margin: ".2em .6em .2em 0"
		},
		"& input[type=checkbox]": {
			marginRight: ".2em"
		},
		"& label": {
			fontSize: "80%"
		}
	},
	"&light .cm-searchMatch": {backgroundColor: "#ffff0054"},
	"&dark .cm-searchMatch": {backgroundColor: "#00ffff8a"},
	"&light .cm-searchMatch-selected": {backgroundColor: "#ff6a0054"},
	"&dark .cm-searchMatch-selected": {backgroundColor: "#ff00ff8a"}
});
const searchExtensions = [
	searchState,
	Prec.override(searchHighlighter),
	baseTheme
];

export {RegExpCursor, SearchCursor, closeSearchPanel, findNext, findPrevious, gotoLine, highlightSelectionMatches, openSearchPanel, replaceAll, replaceNext, searchKeymap, selectMatches, selectSelectionMatches};
