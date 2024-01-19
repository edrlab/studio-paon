import { Text, EditorSelection, Prec } from  './state.js';
import { keymap } from  './view.js';
import { defineLanguageFacet, foldNodeProp, indentNodeProp, languageDataProp, Language, LanguageDescription, EditorParseContext, syntaxTree, LanguageSupport } from  './language.js';
import { styleTags, tags } from  './highlight.js';
import { parser, GFM, Subscript, Superscript, Emoji, MarkdownParser } from  './lezer-markdown.js';
import { htmlLanguage } from  './lang-html.js';

const data = /*@__PURE__*/defineLanguageFacet({ block: { open: "<!--", close: "-->" } });
const commonmark = /*@__PURE__*/parser.configure({
    props: [
        /*@__PURE__*/styleTags({
            "Blockquote/...": tags.quote,
            HorizontalRule: tags.contentSeparator,
            "ATXHeading1/... SetextHeading1/...": tags.heading1,
            "ATXHeading2/... SetextHeading2/...": tags.heading2,
            "ATXHeading3/...": tags.heading3,
            "ATXHeading4/...": tags.heading4,
            "ATXHeading5/...": tags.heading5,
            "ATXHeading6/...": tags.heading6,
            "Comment CommentBlock": tags.comment,
            Escape: tags.escape,
            Entity: tags.character,
            "Emphasis/...": tags.emphasis,
            "StrongEmphasis/...": tags.strong,
            "Link/... Image/...": tags.link,
            "OrderedList/... BulletList/...": tags.list,
            "BlockQuote/...": tags.quote,
            "InlineCode/...": tags.monospace,
            URL: tags.url,
            "HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark": tags.processingInstruction,
            "CodeInfo LinkLabel": tags.labelName,
            LinkTitle: tags.string,
            Paragraph: tags.content
        }),
        /*@__PURE__*/foldNodeProp.add(type => {
            if (!type.is("Block") || type.is("Document"))
                return undefined;
            return (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: tree.to });
        }),
        /*@__PURE__*/indentNodeProp.add({
            Document: () => null
        }),
        /*@__PURE__*/languageDataProp.add({
            Document: data
        })
    ],
    htmlParser: /*@__PURE__*/htmlLanguage.parser.configure({ dialect: "noMatch" }),
});
/**
Language support for strict CommonMark.
*/
const commonmarkLanguage = /*@__PURE__*/mkLang(commonmark);
const extended = /*@__PURE__*/commonmark.configure([GFM, Subscript, Superscript, Emoji, {
        props: [
            /*@__PURE__*/styleTags({
                "TableDelimiter SubscriptMark SuperscriptMark StrikethroughMark": tags.processingInstruction,
                "TableHeader/...": tags.heading,
                "Strikethrough/...": tags.deleted,
                TaskMarker: tags.atom,
                Task: tags.list,
                Emoji: tags.character,
                "Subscript Superscript": /*@__PURE__*/tags.special(tags.content),
                TableCell: tags.content
            })
        ]
    }]);
/**
Language support for [GFM](https://github.github.com/gfm/) plus
subscript, superscript, and emoji syntax.
*/
const markdownLanguage = /*@__PURE__*/mkLang(extended);
function mkLang(parser) {
    return new Language(data, parser, parser.nodeSet.types.find(t => t.name == "Document"));
}
// Create an instance of the Markdown language that will, for code
// blocks, try to find a language that matches the block's info
// string in `languages` or, if none if found, use `defaultLanguage`
// to parse the block.
function addCodeLanguages(languages, defaultLanguage) {
    return {
        codeParser(info) {
            let found = info && LanguageDescription.matchLanguageName(languages, info, true);
            if (!found)
                return defaultLanguage ? defaultLanguage.parser : null;
            if (found.support)
                return found.support.language.parser;
            return EditorParseContext.getSkippingParser(found.load());
        }
    };
}

function nodeStart(node, doc) {
    return doc.sliceString(node.from, node.from + 50);
}
function gatherMarkup(node, line, doc) {
    let nodes = [];
    for (let cur = node; cur && cur.name != "Document"; cur = cur.parent) {
        if (cur.name == "ListItem" || cur.name == "Blockquote")
            nodes.push(cur);
    }
    let markup = [], pos = 0;
    for (let i = nodes.length - 1; i >= 0; i--) {
        let node = nodes[i], match;
        if (node.name == "Blockquote" && (match = /^\s*> ?/.exec(line.slice(pos)))) {
            markup.push({ from: pos, string: match[0], node });
            pos += match[0].length;
        }
        else if (node.name == "ListItem" && node.parent.name == "OrderedList" &&
            (match = /^\s*\d+([.)])\s*/.exec(nodeStart(node, doc)))) {
            let len = match[1].length >= 4 ? match[0].length - match[1].length + 1 : match[0].length;
            markup.push({ from: pos, string: line.slice(pos, pos + len).replace(/\S/g, " "), node });
            pos += len;
        }
        else if (node.name == "ListItem" && node.parent.name == "BulletList" &&
            (match = /^\s*[-+*] (\s*)/.exec(nodeStart(node, doc)))) {
            let len = match[1].length >= 4 ? match[0].length - match[1].length : match[0].length;
            markup.push({ from: pos, string: line.slice(pos, pos + len).replace(/\S/g, " "), node });
            pos += len;
        }
    }
    return markup;
}
function renumberList(after, doc, changes) {
    for (let prev = -1, node = after;;) {
        if (node.name == "ListItem") {
            let m = /^(\s*)(\d+)(?=[.)])/.exec(doc.sliceString(node.from, node.from + 10));
            if (!m)
                return;
            let number = +m[2];
            if (prev >= 0) {
                if (number != prev + 1)
                    return;
                changes.push({ from: node.from + m[1].length, to: node.from + m[0].length, insert: String(prev + 2) });
            }
            prev = number;
        }
        let next = node.nextSibling;
        if (!next)
            break;
        node = next;
    }
}
/**
This command, when invoked in Markdown context with cursor
selection(s), will create a new line with the markup for
blockquotes and lists that were active on the old line. If the
cursor was directly after the end of the markup for the old line,
trailing whitespace and list markers are removed from that line.

The command does nothing in non-Markdown context, so it should
not be used as the only binding for Enter (even in a Markdown
document, HTML and code regions might use a different language).
*/
const insertNewlineContinueMarkup = ({ state, dispatch }) => {
    let tree = syntaxTree(state);
    let dont = null, changes = state.changeByRange(range => {
        if (range.empty && markdownLanguage.isActiveAt(state, range.from)) {
            let line = state.doc.lineAt(range.from);
            let markup = gatherMarkup(tree.resolve(range.from, -1), line.text, state.doc);
            let from = range.from, changes = [];
            if (markup.length) {
                let inner = markup[markup.length - 1], innerEnd = inner.from + inner.string.length;
                if (range.from - line.from >= innerEnd && !/\S/.test(line.text.slice(innerEnd, range.from - line.from))) {
                    let start = /List/.test(inner.node.name) ? inner.from : innerEnd;
                    while (start > 0 && /\s/.test(line.text[start - 1]))
                        start--;
                    from = line.from + start;
                }
                if (inner.node.name == "ListItem") {
                    if (from < range.from && inner.node.parent.from == inner.node.from) { // First item
                        inner.string = "";
                    }
                    else {
                        if (inner.node.from >= line.from)
                            inner.string = line.text.slice(inner.from, inner.from + inner.string.length);
                        else
                            inner.string = /^\s*/.exec(line.text)[0].slice(0, inner.string.length);
                        if (inner.node.parent.name == "OrderedList" && from == range.from) {
                            inner.string = inner.string.replace(/\d+/, m => (+m + 1));
                            renumberList(inner.node, state.doc, changes);
                        }
                    }
                }
            }
            let insert = markup.map(m => m.string).join("");
            if (range.from - line.from < insert.length)
                insert = "";
            changes.push({ from, to: range.from, insert: Text.of(["", insert]) });
            return { range: EditorSelection.cursor(from + 1 + insert.length), changes };
        }
        return dont = { range };
    });
    if (dont)
        return false;
    dispatch(state.update(changes, { scrollIntoView: true }));
    return true;
};
/**
This command will, when invoked in a Markdown context with the
cursor directly after list or blockquote markup, delete one level
of markup. When the markup is for a list, it will be replaced by
spaces on the first invocation (a further invocation will delete
the spaces), to make it easy to continue a list.

When not after Markdown block markup, this command will return
false, so it is intended to be bound alongside other deletion
commands, with a higher precedence than the more generic commands.
*/
const deleteMarkupBackward = ({ state, dispatch }) => {
    let tree = syntaxTree(state);
    let dont = null, changes = state.changeByRange(range => {
        if (range.empty && markdownLanguage.isActiveAt(state, range.from)) {
            let line = state.doc.lineAt(range.from);
            let markup = gatherMarkup(tree.resolve(range.from, -1), line.text, state.doc);
            if (markup.length) {
                let inner = markup[markup.length - 1], innerEnd = inner.from + inner.string.length;
                if (range.from > innerEnd + line.from && !/\S/.test(line.text.slice(innerEnd, range.from - line.from)))
                    return { range: EditorSelection.cursor(innerEnd + line.from),
                        changes: { from: innerEnd + line.from, to: range.from } };
                if (range.from - line.from == innerEnd) {
                    let start = line.from + inner.from;
                    if (inner.node.name == "ListItem" && inner.node.parent.from < inner.node.from &&
                        /\S/.test(line.text.slice(inner.from, innerEnd)))
                        return { range, changes: { from: start, to: start + inner.string.length, insert: inner.string } };
                    return { range: EditorSelection.cursor(start), changes: { from: start, to: range.from } };
                }
            }
        }
        return dont = { range };
    });
    if (dont)
        return false;
    dispatch(state.update(changes, { scrollIntoView: true }));
    return true;
};

/**
A small keymap with Markdown-specific bindings. Binds Enter to
[`insertNewlineContinueMarkup`](https://codemirror.net/6/docs/ref/#lang-markdown.insertNewlineContinueMarkup)
and Backspace to
[`deleteMarkupBackward`](https://codemirror.net/6/docs/ref/#lang-markdown.deleteMarkupBackward).
*/
const markdownKeymap = [
    { key: "Enter", run: insertNewlineContinueMarkup },
    { key: "Backspace", run: deleteMarkupBackward }
];
/**
Markdown language support.
*/
function markdown(config = {}) {
    let { codeLanguages, defaultCodeLanguage, addKeymap = true, base: { parser } = commonmarkLanguage } = config;
    let extensions = config.extensions ? [config.extensions] : [];
    if (!(parser instanceof MarkdownParser))
        throw new RangeError("Base parser provided to `markdown` should be a Markdown parser");
    if (codeLanguages || defaultCodeLanguage)
        extensions.push(addCodeLanguages(codeLanguages || [], defaultCodeLanguage));
    return new LanguageSupport(mkLang(parser.configure(extensions)), addKeymap ? Prec.extend(keymap.of(markdownKeymap)) : []);
}

export { commonmarkLanguage, deleteMarkupBackward, insertNewlineContinueMarkup, markdown, markdownKeymap, markdownLanguage };
