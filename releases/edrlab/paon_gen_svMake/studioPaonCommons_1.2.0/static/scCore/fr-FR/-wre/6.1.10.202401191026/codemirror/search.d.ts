import {Command, KeyBinding} from './view';
import {Extension, StateCommand} from './state';
import {Text} from './text';

/**
A search cursor provides an iterator over text matches in a
document.
 */
declare class SearchCursor implements Iterator<{
	from: number;
	to: number;
}> {
	private iter;
	/**
    The current match (only holds a meaningful value after
    [`next`](https://codemirror.net/6/docs/ref/#search.SearchCursor.next) has been called and when
    `done` is false).
	 */
	value: {
		from: number;
		to: number;
	};
	/**
    Whether the end of the iterated region has been reached.
	 */
	done: boolean;
	private matches;
	private buffer;
	private bufferPos;
	private bufferStart;
	private normalize;
	private query;

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
	constructor(text: Text, query: string, from?: number, to?: number, normalize?: (string: string) => string);

	private peek;

	/**
    Look for the next match. Updates the iterator's
    [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
    [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
    at least once before using the cursor.
	 */
	next(): this;

	/**
    The `next` method will ignore matches that partially overlap a
    previous match. This method behaves like `next`, but includes
    such matches.
	 */
	nextOverlapping(): this;

	private match;
}

declare class RegExpCursor implements Iterator<{
	from: number;
	to: number;
	match: RegExpExecArray;
}> {
	private to;
	private iter;
	private re;
	private curLine;
	private curLineStart;
	private matchPos;
	done: boolean;
	value: {
		from: number;
		to: number;
		match: RegExpExecArray;
	};

	constructor(text: Text, query: string, options?: {
		ignoreCase?: boolean;
	}, from?: number, to?: number);

	private getLine;
	private nextLine;

	next(): this;
}

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
declare const gotoLine: Command;

declare type HighlightOptions = {
	/**
    Determines whether, when nothing is selected, the word around
    the cursor is matched instead. Defaults to false.
	 */
	highlightWordAroundCursor?: boolean;
	/**
    The minimum length of the selection before it is highlighted.
    Defaults to 1 (always highlight non-cursor selections).
	 */
	minSelectionLength?: number;
	/**
    The amount of matches (in the viewport) at which to disable
    highlighting. Defaults to 100.
	 */
	maxMatches?: number;
};

/**
This extension highlights text that matches the selection. It uses
the `"cm-selectionMatch"` class for the highlighting. When
`highlightWordAroundCursor` is enabled, the word at the cursor
itself will be highlighted with `"cm-selectionMatch-main"`.
 */
declare function highlightSelectionMatches(options?: HighlightOptions): Extension;

/**
Open the search panel if it isn't already open, and move the
selection to the first match after the current main selection.
Will wrap around to the start of the document when it reaches the
end.
 */
declare const findNext: Command;
/**
Move the selection to the previous instance of the search query,
before the current main selection. Will wrap past the start
of the document to start searching at the end again.
 */
declare const findPrevious: Command;
/**
Select all instances of the search query.
 */
declare const selectMatches: Command;
/**
Select all instances of the currently selected text.
 */
declare const selectSelectionMatches: StateCommand;
/**
Replace the current match of the search query.
 */
declare const replaceNext: Command;
/**
Replace all instances of the search query with the given
replacement.
 */
declare const replaceAll: Command;
/**
Make sure the search panel is open and focused.
 */
declare const openSearchPanel: Command;
/**
Close the search panel.
 */
declare const closeSearchPanel: Command;
/**
Default search-related key bindings.

 - Mod-f: [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel)
 - F3, Mod-g: [`findNext`](https://codemirror.net/6/docs/ref/#search.findNext)
 - Shift-F3, Shift-Mod-g: [`findPrevious`](https://codemirror.net/6/docs/ref/#search.findPrevious)
 - Alt-g: [`gotoLine`](https://codemirror.net/6/docs/ref/#search.gotoLine)
 */
declare const searchKeymap: readonly KeyBinding[];

export {RegExpCursor, SearchCursor, closeSearchPanel, findNext, findPrevious, gotoLine, highlightSelectionMatches, openSearchPanel, replaceAll, replaceNext, searchKeymap, selectMatches, selectSelectionMatches};
