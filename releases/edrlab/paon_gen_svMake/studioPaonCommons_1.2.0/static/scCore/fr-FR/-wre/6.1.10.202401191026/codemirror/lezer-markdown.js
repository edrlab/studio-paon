import { Tree, NodeType, NodeProp, NodeSet, stringInput } from  './lezer-tree.js';

class CompositeBlock {
    constructor(type, 
    // Used for indentation in list items, markup character in lists
    value, from, hash, end, children, positions) {
        this.type = type;
        this.value = value;
        this.from = from;
        this.hash = hash;
        this.end = end;
        this.children = children;
        this.positions = positions;
    }
    static create(type, value, from, parentHash, end) {
        let hash = (parentHash + (parentHash << 8) + type + (value << 4)) | 0;
        return new CompositeBlock(type, value, from, hash, end, [], []);
    }
    toTree(nodeSet, end = this.end) {
        let last = this.children.length - 1;
        if (last >= 0)
            end = Math.max(end, this.positions[last] + this.children[last].length + this.from);
        let tree = new Tree(nodeSet.types[this.type], this.children, this.positions, end - this.from).balance(2048);
        stampContext(tree.children, this.hash);
        return tree;
    }
    copy() {
        return new CompositeBlock(this.type, this.value, this.from, this.hash, this.end, this.children.slice(), this.positions.slice());
    }
}
var Type;
(function (Type) {
    Type[Type["Document"] = 1] = "Document";
    Type[Type["CodeBlock"] = 2] = "CodeBlock";
    Type[Type["FencedCode"] = 3] = "FencedCode";
    Type[Type["Blockquote"] = 4] = "Blockquote";
    Type[Type["HorizontalRule"] = 5] = "HorizontalRule";
    Type[Type["BulletList"] = 6] = "BulletList";
    Type[Type["OrderedList"] = 7] = "OrderedList";
    Type[Type["ListItem"] = 8] = "ListItem";
    Type[Type["ATXHeading1"] = 9] = "ATXHeading1";
    Type[Type["ATXHeading2"] = 10] = "ATXHeading2";
    Type[Type["ATXHeading3"] = 11] = "ATXHeading3";
    Type[Type["ATXHeading4"] = 12] = "ATXHeading4";
    Type[Type["ATXHeading5"] = 13] = "ATXHeading5";
    Type[Type["ATXHeading6"] = 14] = "ATXHeading6";
    Type[Type["SetextHeading1"] = 15] = "SetextHeading1";
    Type[Type["SetextHeading2"] = 16] = "SetextHeading2";
    Type[Type["HTMLBlock"] = 17] = "HTMLBlock";
    Type[Type["LinkReference"] = 18] = "LinkReference";
    Type[Type["Paragraph"] = 19] = "Paragraph";
    Type[Type["CommentBlock"] = 20] = "CommentBlock";
    Type[Type["ProcessingInstructionBlock"] = 21] = "ProcessingInstructionBlock";
    // Inline
    Type[Type["Escape"] = 22] = "Escape";
    Type[Type["Entity"] = 23] = "Entity";
    Type[Type["HardBreak"] = 24] = "HardBreak";
    Type[Type["Emphasis"] = 25] = "Emphasis";
    Type[Type["StrongEmphasis"] = 26] = "StrongEmphasis";
    Type[Type["Link"] = 27] = "Link";
    Type[Type["Image"] = 28] = "Image";
    Type[Type["InlineCode"] = 29] = "InlineCode";
    Type[Type["HTMLTag"] = 30] = "HTMLTag";
    Type[Type["Comment"] = 31] = "Comment";
    Type[Type["ProcessingInstruction"] = 32] = "ProcessingInstruction";
    Type[Type["URL"] = 33] = "URL";
    // Smaller tokens
    Type[Type["HeaderMark"] = 34] = "HeaderMark";
    Type[Type["QuoteMark"] = 35] = "QuoteMark";
    Type[Type["ListMark"] = 36] = "ListMark";
    Type[Type["LinkMark"] = 37] = "LinkMark";
    Type[Type["EmphasisMark"] = 38] = "EmphasisMark";
    Type[Type["CodeMark"] = 39] = "CodeMark";
    Type[Type["CodeInfo"] = 40] = "CodeInfo";
    Type[Type["LinkTitle"] = 41] = "LinkTitle";
    Type[Type["LinkLabel"] = 42] = "LinkLabel";
})(Type || (Type = {}));
/// Data structure used to accumulate a block's content during [leaf
/// block parsing](#BlockParser.leaf).
class LeafBlock {
    /// @internal
    constructor(
    /// The start position of the block.
    start, 
    /// The block's text content.
    content) {
        this.start = start;
        this.content = content;
        /// @internal
        this.marks = [];
        /// @internal
        this.parsers = [];
    }
}
/// Data structure used during block-level per-line parsing.
class Line {
    constructor() {
        /// The line's full text.
        this.text = "";
        /// The base indent provided by the composite contexts (that have
        /// been handled so far).
        this.baseIndent = 0;
        /// The string position corresponding to the base indent.
        this.basePos = 0;
        /// The number of contexts handled @internal
        this.depth = 0;
        /// Any markers (i.e. block quote markers) parsed for the contexts. @internal
        this.markers = [];
        /// The position of the next non-whitespace character beyond any
        /// list, blockquote, or other composite block markers.
        this.pos = 0;
        /// The column of the next non-whitespace character.
        this.indent = 0;
        /// The character code of the character after `pos`.
        this.next = -1;
    }
    /// @internal
    forward() {
        if (this.basePos > this.pos)
            this.forwardInner();
    }
    /// @internal
    forwardInner() {
        let newPos = this.skipSpace(this.basePos);
        this.indent = this.countIndent(newPos, this.pos, this.indent);
        this.pos = newPos;
        this.next = newPos == this.text.length ? -1 : this.text.charCodeAt(newPos);
    }
    /// Skip whitespace after the given position, return the position of
    /// the next non-space character or the end of the line if there's
    /// only space after `from`.
    skipSpace(from) { return skipSpace(this.text, from); }
    /// @internal
    reset(text) {
        this.text = text;
        this.baseIndent = this.basePos = this.pos = this.indent = 0;
        this.forwardInner();
        this.depth = 1;
        while (this.markers.length)
            this.markers.pop();
    }
    /// Move the line's base position forward to the given position.
    /// This should only be called by composite [block
    /// parsers](#BlockParser.parse) or [markup skipping
    /// functions](#NodeSpec.composite).
    moveBase(to) {
        this.basePos = to;
        this.baseIndent = this.countIndent(to, this.pos, this.indent);
    }
    /// Move the line's base position forward to the given _column_.
    moveBaseColumn(indent) {
        this.baseIndent = indent;
        this.basePos = this.findColumn(indent);
    }
    /// Store a composite-block-level marker. Should be called from
    /// [markup skipping functions](#NodeSpec.composite) when they
    /// consume any non-whitespace characters.
    addMarker(elt) {
        this.markers.push(elt);
    }
    /// Find the column position at `to`, optionally starting at a given
    /// position and column.
    countIndent(to, from = 0, indent = 0) {
        for (let i = from; i < to; i++)
            indent += this.text.charCodeAt(i) == 9 ? 4 - indent % 4 : 1;
        return indent;
    }
    /// Find the position corresponding to the given column.
    findColumn(goal) {
        let i = 0;
        for (let indent = 0; i < this.text.length && indent < goal; i++)
            indent += this.text.charCodeAt(i) == 9 ? 4 - indent % 4 : 1;
        return i;
    }
    /// @internal
    scrub() {
        if (!this.baseIndent)
            return this.text;
        let result = "";
        for (let i = 0; i < this.baseIndent; i++)
            result += " ";
        return result + this.text.slice(this.basePos);
    }
}
function skipForList(bl, cx, line) {
    if (line.pos == line.text.length ||
        (bl != cx.block && line.indent >= cx.stack[line.depth + 1].value + line.baseIndent))
        return true;
    if (line.indent >= line.baseIndent + 4)
        return false;
    let size = (bl.type == Type.OrderedList ? isOrderedList : isBulletList)(line, cx, false);
    return size > 0 &&
        (bl.type != Type.BulletList || isHorizontalRule(line, cx, false) < 0) &&
        line.text.charCodeAt(line.pos + size - 1) == bl.value;
}
const DefaultSkipMarkup = {
    [Type.Blockquote](bl, cx, line) {
        if (line.next != 62 /* '>' */)
            return false;
        line.markers.push(elt(Type.QuoteMark, cx.lineStart + line.pos, cx.lineStart + line.pos + 1));
        line.moveBase(line.pos + 1);
        bl.end = cx.lineStart + line.text.length;
        return true;
    },
    [Type.ListItem](bl, _cx, line) {
        if (line.indent < line.baseIndent + bl.value && line.next > -1)
            return false;
        line.moveBaseColumn(line.baseIndent + bl.value);
        return true;
    },
    [Type.OrderedList]: skipForList,
    [Type.BulletList]: skipForList,
    [Type.Document]() { return true; }
};
function space(ch) { return ch == 32 || ch == 9 || ch == 10 || ch == 13; }
function skipSpace(line, i = 0) {
    while (i < line.length && space(line.charCodeAt(i)))
        i++;
    return i;
}
function skipSpaceBack(line, i, to) {
    while (i > to && space(line.charCodeAt(i - 1)))
        i--;
    return i;
}
function isFencedCode(line) {
    if (line.next != 96 && line.next != 126 /* '`~' */)
        return -1;
    let pos = line.pos + 1;
    while (pos < line.text.length && line.text.charCodeAt(pos) == line.next)
        pos++;
    if (pos < line.pos + 3)
        return -1;
    if (line.next == 96)
        for (let i = pos; i < line.text.length; i++)
            if (line.text.charCodeAt(i) == 96)
                return -1;
    return pos;
}
function isBlockquote(line) {
    return line.next != 62 /* '>' */ ? -1 : line.text.charCodeAt(line.pos + 1) == 32 ? 2 : 1;
}
function isHorizontalRule(line, cx, breaking) {
    if (line.next != 42 && line.next != 45 && line.next != 95 /* '_-*' */)
        return -1;
    let count = 1;
    for (let pos = line.pos + 1; pos < line.text.length; pos++) {
        let ch = line.text.charCodeAt(pos);
        if (ch == line.next)
            count++;
        else if (!space(ch))
            return -1;
    }
    // Setext headers take precedence
    if (breaking && line.next == 45 && isSetextUnderline(line) > -1 && line.depth == cx.stack.length)
        return -1;
    return count < 3 ? -1 : 1;
}
function inList(cx, type) {
    return cx.block.type == type ||
        cx.stack.length > 1 && cx.stack[cx.stack.length - 2].type == type;
}
function isBulletList(line, cx, breaking) {
    return (line.next == 45 || line.next == 43 || line.next == 42 /* '-+*' */) &&
        (line.pos == line.text.length - 1 || space(line.text.charCodeAt(line.pos + 1))) &&
        (!breaking || inList(cx, Type.BulletList) || line.skipSpace(line.pos + 2) < line.text.length) ? 1 : -1;
}
function isOrderedList(line, cx, breaking) {
    let pos = line.pos, next = line.next;
    for (;;) {
        if (next >= 48 && next <= 57 /* '0-9' */)
            pos++;
        else
            break;
        if (pos == line.text.length)
            return -1;
        next = line.text.charCodeAt(pos);
    }
    if (pos == line.pos || pos > line.pos + 9 ||
        (next != 46 && next != 41 /* '.)' */) ||
        (pos < line.text.length - 1 && !space(line.text.charCodeAt(pos + 1))) ||
        breaking && !inList(cx, Type.OrderedList) &&
            (line.skipSpace(pos + 1) == line.text.length || pos > line.pos + 1 || line.next != 49 /* '1' */))
        return -1;
    return pos + 1 - line.pos;
}
function isAtxHeading(line) {
    if (line.next != 35 /* '#' */)
        return -1;
    let pos = line.pos + 1;
    while (pos < line.text.length && line.text.charCodeAt(pos) == 35)
        pos++;
    if (pos < line.text.length && line.text.charCodeAt(pos) != 32)
        return -1;
    let size = pos - line.pos;
    return size > 6 ? -1 : size;
}
function isSetextUnderline(line) {
    if (line.next != 45 && line.next != 61 /* '-=' */ || line.indent >= line.baseIndent + 4)
        return -1;
    let pos = line.pos + 1;
    while (pos < line.text.length && line.text.charCodeAt(pos) == line.next)
        pos++;
    let end = pos;
    while (pos < line.text.length && space(line.text.charCodeAt(pos)))
        pos++;
    return pos == line.text.length ? end : -1;
}
const EmptyLine = /^[ \t]*$/, CommentEnd = /-->/, ProcessingEnd = /\?>/;
const HTMLBlockStyle = [
    [/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
    [/^\s*<!--/, CommentEnd],
    [/^\s*<\?/, ProcessingEnd],
    [/^\s*<![A-Z]/, />/],
    [/^\s*<!\[CDATA\[/, /\]\]>/],
    [/^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i, EmptyLine],
    [/^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i, EmptyLine]
];
function isHTMLBlock(line, _cx, breaking) {
    if (line.next != 60 /* '<' */)
        return -1;
    let rest = line.text.slice(line.pos);
    for (let i = 0, e = HTMLBlockStyle.length - (breaking ? 1 : 0); i < e; i++)
        if (HTMLBlockStyle[i][0].test(rest))
            return i;
    return -1;
}
function getListIndent(line, pos) {
    let indentAfter = line.countIndent(pos, line.pos, line.indent);
    let indented = line.countIndent(line.skipSpace(pos), pos, indentAfter);
    return indented >= indentAfter + 5 ? indentAfter + 1 : indented;
}
// Rules for parsing blocks. A return value of false means the rule
// doesn't apply here, true means it does. When true is returned and
// `p.line` has been updated, the rule is assumed to have consumed a
// leaf block. Otherwise, it is assumed to have opened a context.
const DefaultBlockParsers = {
    LinkReference: undefined,
    IndentedCode(cx, line) {
        let base = line.baseIndent + 4;
        if (line.indent < base)
            return false;
        let start = line.findColumn(base);
        let from = cx.lineStart + start, end = cx.lineStart + line.text.length;
        let marks = [], pendingMarks = [];
        for (; cx.nextLine();) {
            if (line.depth < cx.stack.length)
                break;
            if (line.pos == line.text.length) { // Empty
                for (let m of line.markers)
                    pendingMarks.push(m);
            }
            else if (line.indent < base) {
                break;
            }
            else {
                if (pendingMarks.length) {
                    for (let m of pendingMarks)
                        marks.push(m);
                    pendingMarks = [];
                }
                for (let m of line.markers)
                    marks.push(m);
                end = cx.lineStart + line.text.length;
            }
        }
        if (pendingMarks.length)
            line.markers = pendingMarks.concat(line.markers);
        let nest = !marks.length && cx.parser.codeParser && cx.parser.codeParser("");
        if (nest)
            cx.startNested(from, nest.startParse(cx.input.clip(end), from, cx.parseContext), tree => new Tree(cx.parser.nodeSet.types[Type.CodeBlock], [tree], [0], end - from));
        else
            cx.addNode(cx.buffer.writeElements(marks, -from).finish(Type.CodeBlock, end - from), from);
        return true;
    },
    FencedCode(cx, line) {
        let fenceEnd = isFencedCode(line);
        if (fenceEnd < 0)
            return false;
        let from = cx.lineStart + line.pos, ch = line.next, len = fenceEnd - line.pos;
        let infoFrom = line.skipSpace(fenceEnd), infoTo = skipSpaceBack(line.text, line.text.length, infoFrom);
        let marks = [elt(Type.CodeMark, from, from + len)], info = "";
        if (infoFrom < infoTo) {
            marks.push(elt(Type.CodeInfo, cx.lineStart + infoFrom, cx.lineStart + infoTo));
            info = line.text.slice(infoFrom, infoTo);
        }
        let ownMarks = marks.length, startMarks = ownMarks;
        let codeStart = cx.lineStart + line.text.length + 1, codeEnd = -1;
        for (; cx.nextLine();) {
            if (line.depth < cx.stack.length)
                break;
            for (let m of line.markers)
                marks.push(m);
            let i = line.pos;
            if (line.indent - line.baseIndent < 4)
                while (i < line.text.length && line.text.charCodeAt(i) == ch)
                    i++;
            if (i - line.pos >= len && line.skipSpace(i) == line.text.length) {
                marks.push(elt(Type.CodeMark, cx.lineStart + line.pos, cx.lineStart + i));
                ownMarks++;
                codeEnd = cx.lineStart - 1;
                cx.nextLine();
                break;
            }
        }
        let to = cx.prevLineEnd();
        if (codeEnd < 0)
            codeEnd = to;
        // (Don't try to nest if there are blockquote marks in the region.)
        let nest = marks.length == ownMarks && cx.parser.codeParser && cx.parser.codeParser(info);
        if (nest && codeStart < codeEnd) {
            cx.startNested(from, nest.startParse(cx.input.clip(codeEnd), codeStart, cx.parseContext), tree => {
                marks.splice(startMarks, 0, new TreeElement(tree, codeStart));
                return elt(Type.FencedCode, from, to, marks);
            });
        }
        else {
            cx.addNode(cx.buffer.writeElements(marks, -from).finish(Type.FencedCode, cx.prevLineEnd() - from), from);
        }
        return true;
    },
    Blockquote(cx, line) {
        let size = isBlockquote(line);
        if (size < 0)
            return false;
        cx.startContext(Type.Blockquote, line.pos);
        cx.addNode(Type.QuoteMark, cx.lineStart + line.pos, cx.lineStart + line.pos + 1);
        line.moveBase(line.pos + size);
        return null;
    },
    HorizontalRule(cx, line) {
        if (isHorizontalRule(line, cx, false) < 0)
            return false;
        let from = cx.lineStart + line.pos;
        cx.nextLine();
        cx.addNode(Type.HorizontalRule, from);
        return true;
    },
    BulletList(cx, line) {
        let size = isBulletList(line, cx, false);
        if (size < 0)
            return false;
        if (cx.block.type != Type.BulletList)
            cx.startContext(Type.BulletList, line.basePos, line.next);
        let newBase = getListIndent(line, line.pos + 1);
        cx.startContext(Type.ListItem, line.basePos, newBase - line.baseIndent);
        cx.addNode(Type.ListMark, cx.lineStart + line.pos, cx.lineStart + line.pos + size);
        line.moveBaseColumn(newBase);
        return null;
    },
    OrderedList(cx, line) {
        let size = isOrderedList(line, cx, false);
        if (size < 0)
            return false;
        if (cx.block.type != Type.OrderedList)
            cx.startContext(Type.OrderedList, line.basePos, line.text.charCodeAt(line.pos + size - 1));
        let newBase = getListIndent(line, line.pos + size);
        cx.startContext(Type.ListItem, line.basePos, newBase - line.baseIndent);
        cx.addNode(Type.ListMark, cx.lineStart + line.pos, cx.lineStart + line.pos + size);
        line.moveBaseColumn(newBase);
        return null;
    },
    ATXHeading(cx, line) {
        let size = isAtxHeading(line);
        if (size < 0)
            return false;
        let off = line.pos, from = cx.lineStart + off;
        let endOfSpace = skipSpaceBack(line.text, line.text.length, off), after = endOfSpace;
        while (after > off && line.text.charCodeAt(after - 1) == line.next)
            after--;
        if (after == endOfSpace || after == off || !space(line.text.charCodeAt(after - 1)))
            after = line.text.length;
        let buf = cx.buffer
            .write(Type.HeaderMark, 0, size)
            .writeElements(cx.parser.parseInline(line.text.slice(off + size + 1, after), from + size + 1), -from);
        if (after < line.text.length)
            buf.write(Type.HeaderMark, after - off, endOfSpace - off);
        let node = buf.finish(Type.ATXHeading1 - 1 + size, line.text.length - off);
        cx.nextLine();
        cx.addNode(node, from);
        return true;
    },
    HTMLBlock(cx, line) {
        let type = isHTMLBlock(line, cx, false);
        if (type < 0)
            return false;
        let from = cx.lineStart + line.pos, end = HTMLBlockStyle[type][1];
        let marks = [], trailing = end != EmptyLine;
        while (!end.test(line.text) && cx.nextLine()) {
            if (line.depth < cx.stack.length) {
                trailing = false;
                break;
            }
            for (let m of line.markers)
                marks.push(m);
        }
        if (trailing)
            cx.nextLine();
        let nodeType = end == CommentEnd ? Type.CommentBlock : end == ProcessingEnd ? Type.ProcessingInstructionBlock : Type.HTMLBlock;
        let to = cx.prevLineEnd();
        if (!marks.length && nodeType == Type.HTMLBlock && cx.parser.htmlParser) {
            cx.startNested(from, cx.parser.htmlParser.startParse(cx.input.clip(to), from, cx.parseContext), tree => new Tree(cx.parser.nodeSet.types[nodeType], [tree], [0], to - from));
        }
        else {
            cx.addNode(cx.buffer.writeElements(marks, -from).finish(nodeType, to - from), from);
        }
        return true;
    },
    SetextHeading: undefined // Specifies relative precedence for block-continue function
};
// This implements a state machine that incrementally parses link references. At each
// next line, it looks ahead to see if the line continues the reference or not. If it
// doesn't and a valid link is available ending before that line, it finishes that.
// Similarly, on `finish` (when the leaf is terminated by external circumstances), it
// creates a link reference if there's a valid reference up to the current point.
class LinkReferenceParser {
    constructor(leaf) {
        this.stage = 0 /* Start */;
        this.elts = [];
        this.pos = 0;
        this.start = leaf.start;
        this.advance(leaf.content);
    }
    nextLine(cx, line, leaf) {
        if (this.stage == -1 /* Failed */)
            return false;
        let content = leaf.content + "\n" + line.scrub();
        let finish = this.advance(content);
        if (finish > -1 && finish < content.length)
            return this.complete(cx, leaf, finish);
        return false;
    }
    finish(cx, leaf) {
        if ((this.stage == 2 /* Link */ || this.stage == 3 /* Title */) && skipSpace(leaf.content, this.pos) == leaf.content.length)
            return this.complete(cx, leaf, leaf.content.length);
        return false;
    }
    complete(cx, leaf, len) {
        cx.addLeafElement(leaf, elt(Type.LinkReference, this.start, this.start + len, this.elts));
        return true;
    }
    nextStage(elt) {
        if (elt) {
            this.pos = elt.to - this.start;
            this.elts.push(elt);
            this.stage++;
            return true;
        }
        if (elt === false)
            this.stage = -1 /* Failed */;
        return false;
    }
    advance(content) {
        for (;;) {
            if (this.stage == -1 /* Failed */) {
                return -1;
            }
            else if (this.stage == 0 /* Start */) {
                if (!this.nextStage(parseLinkLabel(content, this.pos, this.start, true)))
                    return -1;
                if (content.charCodeAt(this.pos) != 58 /* ':' */)
                    return this.stage = -1 /* Failed */;
                this.elts.push(elt(Type.LinkMark, this.pos + this.start, this.pos + this.start + 1));
                this.pos++;
            }
            else if (this.stage == 1 /* Label */) {
                if (!this.nextStage(parseURL(content, skipSpace(content, this.pos), this.start)))
                    return -1;
            }
            else if (this.stage == 2 /* Link */) {
                let skip = skipSpace(content, this.pos), end = 0;
                if (skip > this.pos) {
                    let title = parseLinkTitle(content, skip, this.start);
                    if (title) {
                        let titleEnd = lineEnd(content, title.to - this.start);
                        if (titleEnd > 0) {
                            this.nextStage(title);
                            end = titleEnd;
                        }
                    }
                }
                if (!end)
                    end = lineEnd(content, this.pos);
                return end > 0 && end < content.length ? end : -1;
            }
            else { // RefStage.Title
                return lineEnd(content, this.pos);
            }
        }
    }
}
function lineEnd(text, pos) {
    for (; pos < text.length; pos++) {
        let next = text.charCodeAt(pos);
        if (next == 10)
            break;
        if (!space(next))
            return -1;
    }
    return pos;
}
class SetextHeadingParser {
    nextLine(cx, line, leaf) {
        let underline = line.depth < cx.stack.length ? -1 : isSetextUnderline(line);
        let next = line.next;
        if (underline < 0)
            return false;
        let underlineMark = elt(Type.HeaderMark, cx.lineStart + line.pos, cx.lineStart + underline);
        cx.nextLine();
        cx.addLeafElement(leaf, elt(next == 61 ? Type.SetextHeading1 : Type.SetextHeading2, leaf.start, cx.prevLineEnd(), [
            ...cx.parser.parseInline(leaf.content, leaf.start),
            underlineMark
        ]));
        return true;
    }
    finish() {
        return false;
    }
}
const DefaultLeafBlocks = {
    LinkReference(_, leaf) { return leaf.content.charCodeAt(0) == 91 /* '[' */ ? new LinkReferenceParser(leaf) : null; },
    SetextHeading() { return new SetextHeadingParser; }
};
const DefaultEndLeaf = [
    (_, line) => isAtxHeading(line) >= 0,
    (_, line) => isFencedCode(line) >= 0,
    (_, line) => isBlockquote(line) >= 0,
    (p, line) => isBulletList(line, p, true) >= 0,
    (p, line) => isOrderedList(line, p, true) >= 0,
    (p, line) => isHorizontalRule(line, p, true) >= 0,
    (p, line) => isHTMLBlock(line, p, true) >= 0
];
class NestedParse {
    constructor(from, parse, finish) {
        this.from = from;
        this.parse = parse;
        this.finish = finish;
    }
}
/// Block-level parsing functions get access to this context object.
class BlockContext {
    /// @internal
    constructor(
    /// The parser configuration used.
    parser, 
    /// @internal
    input, 
    /// @internal
    startPos, 
    /// @internal
    parseContext) {
        this.parser = parser;
        this.input = input;
        this.parseContext = parseContext;
        this.line = new Line();
        this.atEnd = false;
        this.nested = null;
        this.lineStart = startPos;
        this.block = CompositeBlock.create(Type.Document, 0, this.lineStart, 0, 0);
        this.stack = [this.block];
        this.fragments = (parseContext === null || parseContext === void 0 ? void 0 : parseContext.fragments) ? new FragmentCursor(parseContext.fragments, input) : null;
        this.updateLine(input.lineAfter(this.lineStart));
    }
    get pos() {
        return this.nested ? this.nested.parse.pos : this.lineStart;
    }
    advance() {
        if (this.nested) {
            let done = this.nested.parse.advance();
            if (done) {
                let node = this.nested.finish(done);
                if (node instanceof Element)
                    node = node.toTree(this.parser.nodeSet);
                this.addNode(node, this.nested.from);
                this.nested = null;
            }
            return null;
        }
        let { line } = this;
        for (;;) {
            while (line.depth < this.stack.length)
                this.finishContext();
            for (let mark of line.markers)
                this.addNode(mark.type, mark.from, mark.to);
            if (line.pos < line.text.length)
                break;
            // Empty line
            if (!this.nextLine())
                return this.finish();
        }
        if (this.fragments && this.reuseFragment(line.basePos))
            return null;
        start: for (;;) {
            for (let type of this.parser.blockParsers)
                if (type) {
                    let result = type(this, line);
                    if (result != false) {
                        if (result == true)
                            return null;
                        line.forward();
                        continue start;
                    }
                }
            break;
        }
        let leaf = new LeafBlock(this.lineStart + line.pos, line.text.slice(line.pos));
        for (let parse of this.parser.leafBlockParsers)
            if (parse) {
                let parser = parse(this, leaf);
                if (parser)
                    leaf.parsers.push(parser);
            }
        lines: while (this.nextLine()) {
            if (line.pos == line.text.length)
                break;
            if (line.indent < line.baseIndent + 4) {
                for (let stop of parser.endLeafBlock)
                    if (stop(this, line))
                        break lines;
            }
            for (let parser of leaf.parsers)
                if (parser.nextLine(this, line, leaf))
                    return null;
            leaf.content += "\n" + line.scrub();
            for (let m of line.markers)
                leaf.marks.push(m);
        }
        this.finishLeaf(leaf);
        return null;
    }
    reuseFragment(start) {
        if (!this.fragments.moveTo(this.lineStart + start, this.lineStart) ||
            !this.fragments.matches(this.block.hash))
            return false;
        let taken = this.fragments.takeNodes(this);
        if (!taken)
            return false;
        this.lineStart += taken;
        if (this.lineStart < this.input.length) {
            this.lineStart++;
            this.updateLine(this.input.lineAfter(this.lineStart));
        }
        else {
            this.atEnd = true;
            this.updateLine("");
        }
        return true;
    }
    /// Move to the next input line. This should only be called by
    /// (non-composite) [block parsers](#BlockParser.parse) that consume
    /// the line directly, or leaf block parser
    /// [`nextLine`](#LeafBlockParser.nextLine) methods when they
    /// consume the current line (and return true).
    nextLine() {
        this.lineStart += this.line.text.length;
        if (this.lineStart >= this.input.length) {
            this.atEnd = true;
            this.updateLine("");
            return false;
        }
        else {
            this.lineStart++;
            this.updateLine(this.input.lineAfter(this.lineStart));
            return true;
        }
    }
    /// @internal
    updateLine(text) {
        let { line } = this;
        line.reset(text);
        for (; line.depth < this.stack.length; line.depth++) {
            let cx = this.stack[line.depth], handler = this.parser.skipContextMarkup[cx.type];
            if (!handler)
                throw new Error("Unhandled block context " + Type[cx.type]);
            if (!handler(cx, this, line))
                break;
            line.forward();
        }
    }
    /// The end position of the previous line.
    prevLineEnd() { return this.atEnd ? this.lineStart : this.lineStart - 1; }
    /// @internal
    startContext(type, start, value = 0) {
        this.block = CompositeBlock.create(type, value, this.lineStart + start, this.block.hash, this.lineStart + this.line.text.length);
        this.stack.push(this.block);
    }
    /// Start a composite block. Should only be called from [block
    /// parser functions](#BlockParser.parse) that return null.
    startComposite(type, start, value = 0) {
        this.startContext(this.parser.getNodeType(type), start, value);
    }
    /// @internal
    addNode(block, from, to) {
        if (typeof block == "number")
            block = new Tree(this.parser.nodeSet.types[block], none, none, (to !== null && to !== void 0 ? to : this.prevLineEnd()) - from);
        this.block.children.push(block);
        this.block.positions.push(from - this.block.from);
    }
    /// Add a block element. Can be called by [block
    /// parsers](#BlockParser.parse).
    addElement(elt) {
        this.block.children.push(elt.toTree(this.parser.nodeSet));
        this.block.positions.push(elt.from - this.block.from);
    }
    /// Add a block element from a [leaf parser](#LeafBlockParser). This
    /// makes sure any extra composite block markup (such as blockquote
    /// markers) inside the block are also added to the syntax tree.
    addLeafElement(leaf, elt) {
        this.addNode(this.buffer
            .writeElements(injectMarks(elt.children, leaf.marks), -elt.from)
            .finish(elt.type, elt.to - elt.from), elt.from);
    }
    /// Start a nested parse at the given position. When it finishes,
    /// the `finish` callback is called with the resulting tree, and
    /// should return the finished node for the block element.
    startNested(from, parse, finish) {
        this.nested = new NestedParse(from, parse, finish);
    }
    /// @internal
    finishContext() {
        this.block = finishContext(this.stack, this.parser.nodeSet);
    }
    finish() {
        while (this.stack.length > 1)
            this.finishContext();
        return this.block.toTree(this.parser.nodeSet, this.lineStart);
    }
    forceFinish() {
        let cx = this.stack.map(cx => cx.copy()), pos = this.lineStart;
        if (this.nested) {
            let inner = cx[cx.length - 1];
            let result = this.nested.finish(this.nested.parse.forceFinish());
            if (result instanceof Element)
                result = result.toTree(this.parser.nodeSet);
            let len = pos - this.nested.from;
            if (result.length > len)
                result = new Tree(result.type, result.children.filter((_, i) => result.positions[i] <= len), result.positions.filter(p => p <= len), len);
            inner.children.push(result);
            inner.positions.push(this.nested.from);
        }
        while (cx.length > 1)
            finishContext(cx, this.parser.nodeSet);
        return cx[0].toTree(this.parser.nodeSet, pos);
    }
    /// @internal
    finishLeaf(leaf) {
        for (let parser of leaf.parsers)
            if (parser.finish(this, leaf))
                return;
        let inline = injectMarks(this.parser.parseInline(leaf.content, leaf.start), leaf.marks);
        this.addNode(this.buffer
            .writeElements(inline, -leaf.start)
            .finish(Type.Paragraph, leaf.content.length), leaf.start);
    }
    elt(type, from, to, children) {
        if (typeof type == "string")
            return elt(this.parser.getNodeType(type), from, to, children);
        return new TreeElement(type, from);
    }
    /// @internal
    get buffer() { return new Buffer(this.parser.nodeSet); }
}
/// A Markdown parser configuration.
class MarkdownParser {
    /// @internal
    constructor(
    /// The parser's syntax [node
    /// types](https://lezer.codemirror.net/docs/ref/#tree.NodeSet).
    nodeSet, 
    /// @internal
    codeParser, 
    /// @internal
    htmlParser, 
    /// @internal
    blockParsers, 
    /// @internal
    leafBlockParsers, 
    /// @internal
    blockNames, 
    /// @internal
    endLeafBlock, 
    /// @internal
    skipContextMarkup, 
    /// @internal
    inlineParsers, 
    /// @internal
    inlineNames) {
        this.nodeSet = nodeSet;
        this.codeParser = codeParser;
        this.htmlParser = htmlParser;
        this.blockParsers = blockParsers;
        this.leafBlockParsers = leafBlockParsers;
        this.blockNames = blockNames;
        this.endLeafBlock = endLeafBlock;
        this.skipContextMarkup = skipContextMarkup;
        this.inlineParsers = inlineParsers;
        this.inlineNames = inlineNames;
        /// @internal
        this.nodeTypes = Object.create(null);
        for (let t of nodeSet.types)
            this.nodeTypes[t.name] = t.id;
    }
    /// Start a parse on the given input.
    startParse(input, startPos = 0, parseContext = {}) {
        return new BlockContext(this, input, startPos, parseContext);
    }
    /// Reconfigure the parser.
    configure(spec) {
        let config = resolveConfig(spec);
        if (!config)
            return this;
        let { nodeSet, skipContextMarkup } = this;
        let blockParsers = this.blockParsers.slice(), leafBlockParsers = this.leafBlockParsers.slice(), blockNames = this.blockNames.slice(), inlineParsers = this.inlineParsers.slice(), inlineNames = this.inlineNames.slice(), endLeafBlock = this.endLeafBlock.slice();
        if (nonEmpty(config.defineNodes)) {
            skipContextMarkup = Object.assign({}, skipContextMarkup);
            let nodeTypes = nodeSet.types.slice();
            for (let s of config.defineNodes) {
                let { name, block, composite } = typeof s == "string" ? { name: s } : s;
                if (nodeTypes.some(t => t.name == name))
                    continue;
                if (composite)
                    skipContextMarkup[nodeTypes.length] =
                        (bl, cx, line) => composite(cx, line, bl.value);
                let id = nodeTypes.length;
                let group = composite ? ["Block", "BlockContext"] : !block ? undefined
                    : id >= Type.ATXHeading1 && id <= Type.SetextHeading2 ? ["Block", "LeafBlock", "Heading"] : ["Block", "LeafBlock"];
                nodeTypes.push(NodeType.define({
                    id,
                    name,
                    props: group && [[NodeProp.group, group]]
                }));
            }
            nodeSet = new NodeSet(nodeTypes);
        }
        if (nonEmpty(config.props))
            nodeSet = nodeSet.extend(...config.props);
        if (nonEmpty(config.remove)) {
            for (let rm of config.remove) {
                let block = this.blockNames.indexOf(rm), inline = this.inlineNames.indexOf(rm);
                if (block > -1)
                    blockParsers[block] = leafBlockParsers[block] = undefined;
                if (inline > -1)
                    inlineParsers[inline] = undefined;
            }
        }
        if (nonEmpty(config.parseBlock)) {
            for (let spec of config.parseBlock) {
                let found = blockNames.indexOf(spec.name);
                if (found > -1) {
                    blockParsers[found] = spec.parse;
                    leafBlockParsers[found] = spec.leaf;
                }
                else {
                    let pos = spec.before ? findName(blockNames, spec.before)
                        : spec.after ? findName(blockNames, spec.after) + 1 : blockNames.length - 1;
                    blockParsers.splice(pos, 0, spec.parse);
                    leafBlockParsers.splice(pos, 0, spec.leaf);
                    blockNames.splice(pos, 0, spec.name);
                }
                if (spec.endLeaf)
                    endLeafBlock.push(spec.endLeaf);
            }
        }
        if (nonEmpty(config.parseInline)) {
            for (let spec of config.parseInline) {
                let found = inlineNames.indexOf(spec.name);
                if (found > -1) {
                    inlineParsers[found] = spec.parse;
                }
                else {
                    let pos = spec.before ? findName(inlineNames, spec.before)
                        : spec.after ? findName(inlineNames, spec.after) + 1 : inlineNames.length - 1;
                    inlineParsers.splice(pos, 0, spec.parse);
                    inlineNames.splice(pos, 0, spec.name);
                }
            }
        }
        return new MarkdownParser(nodeSet, config.codeParser || this.codeParser, config.htmlParser || this.htmlParser, blockParsers, leafBlockParsers, blockNames, endLeafBlock, skipContextMarkup, inlineParsers, inlineNames);
    }
    /// @internal
    getNodeType(name) {
        let found = this.nodeTypes[name];
        if (found == null)
            throw new RangeError(`Unknown node type '${name}'`);
        return found;
    }
    /// Parse the given piece of inline text at the given offset,
    /// returning an array of [`Element`](#Element) objects representing
    /// the inline content.
    parseInline(text, offset) {
        let cx = new InlineContext(this, text, offset);
        outer: for (let pos = offset; pos < cx.end;) {
            let next = cx.char(pos);
            for (let token of this.inlineParsers)
                if (token) {
                    let result = token(cx, next, pos);
                    if (result >= 0) {
                        pos = result;
                        continue outer;
                    }
                }
            pos++;
        }
        return cx.resolveMarkers(0);
    }
}
function nonEmpty(a) {
    return a != null && a.length > 0;
}
function resolveConfig(spec) {
    if (!Array.isArray(spec))
        return spec;
    if (spec.length == 0)
        return null;
    let conf = resolveConfig(spec[0]);
    if (spec.length == 1)
        return conf;
    let rest = resolveConfig(spec.slice(1));
    if (!rest || !conf)
        return conf || rest;
    let conc = (a, b) => (a || none).concat(b || none);
    return { props: conc(conf.props, rest.props),
        codeParser: rest.codeParser || conf.codeParser,
        htmlParser: rest.htmlParser || conf.htmlParser,
        defineNodes: conc(conf.defineNodes, rest.defineNodes),
        parseBlock: conc(conf.parseBlock, rest.parseBlock),
        parseInline: conc(conf.parseInline, rest.parseInline),
        remove: conc(conf.remove, rest.remove) };
}
function findName(names, name) {
    let found = names.indexOf(name);
    if (found < 0)
        throw new RangeError(`Position specified relative to unknown parser ${name}`);
    return found;
}
let nodeTypes = [NodeType.none];
for (let i = 1, name; name = Type[i]; i++) {
    nodeTypes[i] = NodeType.define({
        id: i,
        name,
        props: i >= Type.Escape ? [] : [[NodeProp.group, i in DefaultSkipMarkup ? ["Block", "BlockContext"] : ["Block", "LeafBlock"]]]
    });
}
function finishContext(stack, nodeSet) {
    let cx = stack.pop();
    let top = stack[stack.length - 1];
    top.children.push(cx.toTree(nodeSet));
    top.positions.push(cx.from - top.from);
    return top;
}
const none = [];
class Buffer {
    constructor(nodeSet) {
        this.nodeSet = nodeSet;
        this.content = [];
        this.nodes = [];
    }
    write(type, from, to, children = 0) {
        this.content.push(type, from, to, 4 + children * 4);
        return this;
    }
    writeElements(elts, offset = 0) {
        for (let e of elts)
            e.writeTo(this, offset);
        return this;
    }
    finish(type, length) {
        return Tree.build({
            buffer: this.content,
            nodeSet: this.nodeSet,
            reused: this.nodes,
            topID: type,
            length
        });
    }
}
/// Elements are used to compose syntax nodes during parsing.
class Element {
    /// @internal
    constructor(
    /// The node's
    /// [id](https://lezer.codemirror.net/docs/ref/#tree.NodeType.id).
    type, 
    /// The start of the node, as an offset from the start of the document.
    from, 
    /// The end of the node.
    to, 
    /// The node's child nodes @internal
    children = none) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.children = children;
    }
    /// @internal
    writeTo(buf, offset) {
        let startOff = buf.content.length;
        buf.writeElements(this.children, offset);
        buf.content.push(this.type, this.from + offset, this.to + offset, buf.content.length + 4 - startOff);
    }
    /// @internal
    toTree(nodeSet) {
        return new Buffer(nodeSet).writeElements(this.children, -this.from).finish(this.type, this.to - this.from);
    }
}
class TreeElement {
    constructor(tree, from) {
        this.tree = tree;
        this.from = from;
    }
    get to() { return this.from + this.tree.length; }
    get type() { return this.tree.type.id; }
    get children() { return none; }
    writeTo(buf, offset) {
        buf.nodes.push(this.tree);
        buf.content.push(buf.nodes.length - 1, this.from + offset, this.to + offset, -1);
    }
    toTree() { return this.tree; }
}
function elt(type, from, to, children) {
    return new Element(type, from, to, children);
}
const EmphasisUnderscore = { resolve: "Emphasis", mark: "EmphasisMark" };
const EmphasisAsterisk = { resolve: "Emphasis", mark: "EmphasisMark" };
const LinkStart = {}, ImageStart = {};
class InlineDelimiter {
    constructor(type, from, to, side) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.side = side;
    }
}
const Escapable = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
let Punctuation = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;
try {
    Punctuation = /[\p{Pc}|\p{Pd}|\p{Pe}|\p{Pf}|\p{Pi}|\p{Po}|\p{Ps}]/u;
}
catch (_) { }
const DefaultInline = {
    Escape(cx, next, start) {
        if (next != 92 /* '\\' */ || start == cx.end - 1)
            return -1;
        let escaped = cx.char(start + 1);
        for (let i = 0; i < Escapable.length; i++)
            if (Escapable.charCodeAt(i) == escaped)
                return cx.append(elt(Type.Escape, start, start + 2));
        return -1;
    },
    Entity(cx, next, start) {
        if (next != 38 /* '&' */)
            return -1;
        let m = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(cx.slice(start + 1, start + 31));
        return m ? cx.append(elt(Type.Entity, start, start + 1 + m[0].length)) : -1;
    },
    InlineCode(cx, next, start) {
        if (next != 96 /* '`' */ || start && cx.char(start - 1) == 96)
            return -1;
        let pos = start + 1;
        while (pos < cx.end && cx.char(pos) == 96)
            pos++;
        let size = pos - start, curSize = 0;
        for (; pos < cx.end; pos++) {
            if (cx.char(pos) == 96) {
                curSize++;
                if (curSize == size && cx.char(pos + 1) != 96)
                    return cx.append(elt(Type.InlineCode, start, pos + 1, [
                        elt(Type.CodeMark, start, start + size),
                        elt(Type.CodeMark, pos + 1 - size, pos + 1)
                    ]));
            }
            else {
                curSize = 0;
            }
        }
        return -1;
    },
    HTMLTag(cx, next, start) {
        if (next != 60 /* '<' */ || start == cx.end - 1)
            return -1;
        let after = cx.slice(start + 1, cx.end);
        let url = /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(after);
        if (url)
            return cx.append(elt(Type.URL, start, start + 1 + url[0].length));
        let comment = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(after);
        if (comment)
            return cx.append(elt(Type.Comment, start, start + 1 + comment[0].length));
        let procInst = /^\?[^]*?\?>/.exec(after);
        if (procInst)
            return cx.append(elt(Type.ProcessingInstruction, start, start + 1 + procInst[0].length));
        let m = /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(after);
        if (!m)
            return -1;
        let children = [];
        if (cx.parser.htmlParser) {
            let p = cx.parser.htmlParser.startParse(stringInput(cx.slice(start, start + 1 + m[0].length)), 0, {}), tree;
            while (!(tree = p.advance())) { }
            children = tree.children.map((ch, i) => new TreeElement(ch, start + tree.positions[i]));
        }
        return cx.append(elt(Type.HTMLTag, start, start + 1 + m[0].length, children));
    },
    Emphasis(cx, next, start) {
        if (next != 95 && next != 42)
            return -1;
        let pos = start + 1;
        while (cx.char(pos) == next)
            pos++;
        let before = cx.slice(start - 1, start), after = cx.slice(pos, pos + 1);
        let pBefore = Punctuation.test(before), pAfter = Punctuation.test(after);
        let sBefore = /\s|^$/.test(before), sAfter = /\s|^$/.test(after);
        let leftFlanking = !sAfter && (!pAfter || sBefore || pBefore);
        let rightFlanking = !sBefore && (!pBefore || sAfter || pAfter);
        let canOpen = leftFlanking && (next == 42 || !rightFlanking || pBefore);
        let canClose = rightFlanking && (next == 42 || !leftFlanking || pAfter);
        return cx.append(new InlineDelimiter(next == 95 ? EmphasisUnderscore : EmphasisAsterisk, start, pos, (canOpen ? 1 /* Open */ : 0) | (canClose ? 2 /* Close */ : 0)));
    },
    HardBreak(cx, next, start) {
        if (next == 92 /* '\\' */ && cx.char(start + 1) == 10 /* '\n' */)
            return cx.append(elt(Type.HardBreak, start, start + 2));
        if (next == 32) {
            let pos = start + 1;
            while (cx.char(pos) == 32)
                pos++;
            if (cx.char(pos) == 10 && pos >= start + 2)
                return cx.append(elt(Type.HardBreak, start, pos + 1));
        }
        return -1;
    },
    Link(cx, next, start) {
        return next == 91 /* '[' */ ? cx.append(new InlineDelimiter(LinkStart, start, start + 1, 1 /* Open */)) : -1;
    },
    Image(cx, next, start) {
        return next == 33 /* '!' */ && cx.char(start + 1) == 91 /* '[' */
            ? cx.append(new InlineDelimiter(ImageStart, start, start + 2, 1 /* Open */)) : -1;
    },
    LinkEnd(cx, next, start) {
        if (next != 93 /* ']' */)
            return -1;
        // Scanning back to the next link/image start marker
        for (let i = cx.parts.length - 1; i >= 0; i--) {
            let part = cx.parts[i];
            if (part instanceof InlineDelimiter && (part.type == LinkStart || part.type == ImageStart)) {
                // If this one has been set invalid (because it would produce
                // a nested link) or there's no valid link here ignore both.
                if (!part.side || cx.skipSpace(part.to) == start && !/[(\[]/.test(cx.slice(start + 1, start + 2))) {
                    cx.parts[i] = null;
                    return -1;
                }
                // Finish the content and replace the entire range in
                // this.parts with the link/image node.
                let content = cx.takeContent(i);
                let link = cx.parts[i] = finishLink(cx, content, part.type == LinkStart ? Type.Link : Type.Image, part.from, start + 1);
                // Set any open-link markers before this link to invalid.
                if (part.type == LinkStart)
                    for (let j = 0; j < i; j++) {
                        let p = cx.parts[j];
                        if (p instanceof InlineDelimiter && p.type == LinkStart)
                            p.side = 0;
                    }
                return link.to;
            }
        }
        return -1;
    }
};
function finishLink(cx, content, type, start, startPos) {
    let { text } = cx, next = cx.char(startPos), endPos = startPos;
    content.unshift(elt(Type.LinkMark, start, start + (type == Type.Image ? 2 : 1)));
    content.push(elt(Type.LinkMark, startPos - 1, startPos));
    if (next == 40 /* '(' */) {
        let pos = cx.skipSpace(startPos + 1);
        let dest = parseURL(text, pos - cx.offset, cx.offset), title;
        if (dest) {
            pos = cx.skipSpace(dest.to);
            title = parseLinkTitle(text, pos - cx.offset, cx.offset);
            if (title)
                pos = cx.skipSpace(title.to);
        }
        if (cx.char(pos) == 41 /* ')' */) {
            content.push(elt(Type.LinkMark, startPos, startPos + 1));
            endPos = pos + 1;
            if (dest)
                content.push(dest);
            if (title)
                content.push(title);
            content.push(elt(Type.LinkMark, pos, endPos));
        }
    }
    else if (next == 91 /* '[' */) {
        let label = parseLinkLabel(text, startPos - cx.offset, cx.offset, false);
        if (label) {
            content.push(label);
            endPos = label.to;
        }
    }
    return elt(type, start, endPos, content);
}
// These return `null` when falling off the end of the input, `false`
// when parsing fails otherwise (for use in the incremental link
// reference parser).
function parseURL(text, start, offset) {
    let next = text.charCodeAt(start);
    if (next == 60 /* '<' */) {
        for (let pos = start + 1; pos < text.length; pos++) {
            let ch = text.charCodeAt(pos);
            if (ch == 62 /* '>' */)
                return elt(Type.URL, start + offset, pos + 1 + offset);
            if (ch == 60 || ch == 10 /* '<\n' */)
                return false;
        }
        return null;
    }
    else {
        let depth = 0, pos = start;
        for (let escaped = false; pos < text.length; pos++) {
            let ch = text.charCodeAt(pos);
            if (space(ch)) {
                break;
            }
            else if (escaped) {
                escaped = false;
            }
            else if (ch == 40 /* '(' */) {
                depth++;
            }
            else if (ch == 41 /* ')' */) {
                if (!depth)
                    break;
                depth--;
            }
            else if (ch == 92 /* '\\' */) {
                escaped = true;
            }
        }
        return pos > start ? elt(Type.URL, start + offset, pos + offset) : pos == text.length ? null : false;
    }
}
function parseLinkTitle(text, start, offset) {
    let next = text.charCodeAt(start);
    if (next != 39 && next != 34 && next != 40 /* '"\'(' */)
        return false;
    let end = next == 40 ? 41 : next;
    for (let pos = start + 1, escaped = false; pos < text.length; pos++) {
        let ch = text.charCodeAt(pos);
        if (escaped)
            escaped = false;
        else if (ch == end)
            return elt(Type.LinkTitle, start + offset, pos + 1 + offset);
        else if (ch == 92 /* '\\' */)
            escaped = true;
    }
    return null;
}
function parseLinkLabel(text, start, offset, requireNonWS) {
    for (let escaped = false, pos = start + 1, end = Math.min(text.length, pos + 999); pos < end; pos++) {
        let ch = text.charCodeAt(pos);
        if (escaped)
            escaped = false;
        else if (ch == 93 /* ']' */)
            return requireNonWS ? false : elt(Type.LinkLabel, start + offset, pos + 1 + offset);
        else {
            if (requireNonWS && !space(ch))
                requireNonWS = false;
            if (ch == 91 /* '[' */)
                return false;
            else if (ch == 92 /* '\\' */)
                escaped = true;
        }
    }
    return null;
}
/// Inline parsing functions get access to this context, and use it to
/// read the content and emit syntax nodes.
class InlineContext {
    /// @internal
    constructor(
    /// The parser that is being used.
    parser, 
    /// The text of this inline section.
    text, 
    /// The starting offset of the section in the document.
    offset) {
        this.parser = parser;
        this.text = text;
        this.offset = offset;
        /// @internal
        this.parts = [];
    }
    /// Get the character code at the given (document-relative)
    /// position.
    char(pos) { return pos >= this.end ? -1 : this.text.charCodeAt(pos - this.offset); }
    /// The position of the end of this inline section.
    get end() { return this.offset + this.text.length; }
    /// Get a substring of this inline section. Again uses
    /// document-relative positions.
    slice(from, to) { return this.text.slice(from - this.offset, to - this.offset); }
    /// @internal
    append(elt) {
        this.parts.push(elt);
        return elt.to;
    }
    /// Add a [delimiter](#DelimiterType) at this given position. `open`
    /// and `close` indicate whether this delimiter is opening, closing,
    /// or both. Returns the end of the delimiter, for convenient
    /// returning from [parse functions](#InlineParser.parse).
    addDelimiter(type, from, to, open, close) {
        return this.append(new InlineDelimiter(type, from, to, (open ? 1 /* Open */ : 0) | (close ? 2 /* Close */ : 0)));
    }
    /// Add an inline element. Returns the end of the element.
    addElement(elt) {
        return this.append(elt);
    }
    /// @internal
    resolveMarkers(from) {
        for (let i = from; i < this.parts.length; i++) {
            let close = this.parts[i];
            if (!(close instanceof InlineDelimiter && close.type.resolve && (close.side & 2 /* Close */)))
                continue;
            let emp = close.type == EmphasisUnderscore || close.type == EmphasisAsterisk;
            let closeSize = close.to - close.from;
            let open, j = i - 1;
            for (; j >= from; j--) {
                let part = this.parts[j];
                if (!(part instanceof InlineDelimiter && (part.side & 1 /* Open */) && part.type == close.type) ||
                    emp && ((close.side & 1 /* Open */) || (part.side & 2 /* Close */)) &&
                        (part.to - part.from + closeSize) % 3 == 0 && ((part.to - part.from) % 3 || closeSize % 3))
                    continue;
                open = part;
                break;
            }
            if (!open)
                continue;
            let type = close.type.resolve, content = [];
            let start = open.from, end = close.to;
            if (emp) {
                let size = Math.min(2, open.to - open.from, closeSize);
                start = open.to - size;
                end = close.from + size;
                type = size == 1 ? "Emphasis" : "StrongEmphasis";
            }
            if (open.type.mark)
                content.push(this.elt(open.type.mark, start, open.to));
            for (let k = j + 1; k < i; k++) {
                if (this.parts[k] instanceof Element)
                    content.push(this.parts[k]);
                this.parts[k] = null;
            }
            if (close.type.mark)
                content.push(this.elt(close.type.mark, close.from, end));
            let element = this.elt(type, start, end, content);
            this.parts[j] = emp && open.from != start ? new InlineDelimiter(open.type, open.from, start, open.side) : null;
            let keep = this.parts[i] = emp && close.to != end ? new InlineDelimiter(close.type, end, close.to, close.side) : null;
            if (keep)
                this.parts.splice(i, 0, element);
            else
                this.parts[i] = element;
        }
        let result = [];
        for (let i = from; i < this.parts.length; i++) {
            let part = this.parts[i];
            if (part instanceof Element)
                result.push(part);
        }
        return result;
    }
    /// Find an opening delimiter of the given type. Returns `null` if
    /// no delimiter is found, or an index that can be passed to
    /// [`takeContent`](#InlineContext.takeContent) otherwise.
    findOpeningDelimiter(type) {
        for (let i = this.parts.length - 1; i >= 0; i--) {
            let part = this.parts[i];
            if (part instanceof InlineDelimiter && part.type == type)
                return i;
        }
        return null;
    }
    /// Remove all inline elements and delimiters starting from the
    /// given index (which you should get from
    /// [`findOpeningDelimiter`](#InlineContext.findOpeningDelimiter),
    /// resolve delimiters inside of them, and return them as an array
    /// of elements.
    takeContent(startIndex) {
        let content = this.resolveMarkers(startIndex);
        this.parts.length = startIndex;
        return content;
    }
    /// Skip space after the given (document) position, returning either
    /// the position of the next non-space character or the end of the
    /// section.
    skipSpace(from) { return skipSpace(this.text, from - this.offset) + this.offset; }
    elt(type, from, to, children) {
        if (typeof type == "string")
            return elt(this.parser.getNodeType(type), from, to, children);
        return new TreeElement(type, from);
    }
}
function injectMarks(elements, marks) {
    if (!marks.length)
        return elements;
    if (!elements.length)
        return marks;
    let elts = elements.slice(), eI = 0;
    for (let mark of marks) {
        while (eI < elts.length && elts[eI].to < mark.to)
            eI++;
        if (eI < elts.length && elts[eI].from < mark.from) {
            let e = elts[eI];
            if (e instanceof Element)
                elts[eI] = new Element(e.type, e.from, e.to, injectMarks(e.children, [mark]));
        }
        else {
            elts.splice(eI++, 0, mark);
        }
    }
    return elts;
}
const ContextHash = new WeakMap();
function stampContext(nodes, hash) {
    for (let n of nodes) {
        ContextHash.set(n, hash);
        if (n instanceof Tree && n.type.isAnonymous)
            stampContext(n.children, hash);
    }
}
// These are blocks that can span blank lines, and should thus only be
// reused if their next sibling is also being reused.
const NotLast = [Type.CodeBlock, Type.ListItem, Type.OrderedList, Type.BulletList];
class FragmentCursor {
    constructor(fragments, input) {
        this.fragments = fragments;
        this.input = input;
        // Index into fragment array
        this.i = 0;
        // Active fragment
        this.fragment = null;
        this.fragmentEnd = -1;
        // Cursor into the current fragment, if any. When `moveTo` returns
        // true, this points at the first block after `pos`.
        this.cursor = null;
        if (fragments.length)
            this.fragment = fragments[this.i++];
    }
    nextFragment() {
        this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null;
        this.cursor = null;
        this.fragmentEnd = -1;
    }
    moveTo(pos, lineStart) {
        while (this.fragment && this.fragment.to <= pos)
            this.nextFragment();
        if (!this.fragment || this.fragment.from > (pos ? pos - 1 : 0))
            return false;
        if (this.fragmentEnd < 0) {
            let end = this.fragment.to;
            while (end > 0 && this.input.get(end - 1) != 10)
                end--;
            this.fragmentEnd = end ? end - 1 : 0;
        }
        let c = this.cursor;
        if (!c) {
            c = this.cursor = this.fragment.tree.cursor();
            c.firstChild();
        }
        let rPos = pos + this.fragment.offset;
        while (c.to <= rPos)
            if (!c.parent())
                return false;
        for (;;) {
            if (c.from >= rPos)
                return this.fragment.from <= lineStart;
            if (!c.childAfter(rPos))
                return false;
        }
    }
    matches(hash) {
        let tree = this.cursor.tree;
        return tree && ContextHash.get(tree) == hash;
    }
    takeNodes(cx) {
        let cur = this.cursor, off = this.fragment.offset;
        let start = cx.lineStart, end = start, blockI = cx.block.children.length;
        let prevEnd = end, prevI = blockI;
        for (;;) {
            if (cur.to - off >= this.fragmentEnd) {
                if (cur.type.isAnonymous && cur.firstChild())
                    continue;
                break;
            }
            cx.addNode(cur.tree, cur.from - off);
            // Taken content must always end in a block, because incremental
            // parsing happens on block boundaries. Never stop directly
            // after an indented code block, since those can continue after
            // any number of blank lines.
            if (cur.type.is("Block")) {
                if (NotLast.indexOf(cur.type.id) < 0) {
                    end = cur.to - off;
                    blockI = cx.block.children.length;
                }
                else {
                    end = prevEnd;
                    blockI = prevI;
                    prevEnd = cur.to - off;
                    prevI = cx.block.children.length;
                }
            }
            if (!cur.nextSibling())
                break;
        }
        while (cx.block.children.length > blockI) {
            cx.block.children.pop();
            cx.block.positions.pop();
        }
        return end - start;
    }
}
/// The default CommonMark parser.
const parser = new MarkdownParser(new NodeSet(nodeTypes), null, null, Object.keys(DefaultBlockParsers).map(n => DefaultBlockParsers[n]), Object.keys(DefaultBlockParsers).map(n => DefaultLeafBlocks[n]), Object.keys(DefaultBlockParsers), DefaultEndLeaf, DefaultSkipMarkup, Object.keys(DefaultInline).map(n => DefaultInline[n]), Object.keys(DefaultInline));

const StrikethroughDelim = { resolve: "Strikethrough", mark: "StrikethroughMark" };
/// An extension that implements
/// [GFM-style](https://github.github.com/gfm/#strikethrough-extension-)
/// Strikethrough syntax using `~~` delimiters.
const Strikethrough = {
    defineNodes: ["Strikethrough", "StrikethroughMark"],
    parseInline: [{
            name: "Strikethrough",
            parse(cx, next, pos) {
                if (next != 126 /* '~' */ || cx.char(pos + 1) != 126)
                    return -1;
                return cx.addDelimiter(StrikethroughDelim, pos, pos + 2, true, true);
            },
            after: "Emphasis"
        }]
};
function parseRow(cx, line, startI = 0, elts, offset = 0) {
    let count = 0, first = true, cellStart = -1, cellEnd = -1, esc = false;
    let parseCell = () => {
        elts.push(cx.elt("TableCell", offset + cellStart, offset + cellEnd, cx.parser.parseInline(line.slice(cellStart, cellEnd), offset + cellStart)));
    };
    for (let i = startI; i < line.length; i++) {
        let next = line.charCodeAt(i);
        if (next == 124 /* '|' */ && !esc) {
            if (!first || cellStart > -1)
                count++;
            first = false;
            if (elts) {
                if (cellStart > -1)
                    parseCell();
                elts.push(cx.elt("TableDelimiter", i + offset, i + offset + 1));
            }
            cellStart = cellEnd = -1;
        }
        else if (esc || next != 32 && next != 9) {
            if (cellStart < 0)
                cellStart = i;
            cellEnd = i + 1;
        }
        esc = !esc && next == 92;
    }
    if (cellStart > -1) {
        count++;
        if (elts)
            parseCell();
    }
    return count;
}
function hasPipe(str, start) {
    for (let i = start; i < str.length; i++) {
        let next = str.charCodeAt(i);
        if (next == 124 /* '|' */)
            return true;
        if (next == 92 /* '\\' */)
            i++;
    }
    return false;
}
class TableParser {
    constructor() {
        // Null means we haven't seen the second line yet, false means this
        // isn't a table, and an array means this is a table and we've
        // parsed the given rows so far.
        this.rows = null;
    }
    nextLine(cx, line, leaf) {
        if (this.rows == null) { // Second line
            this.rows = false;
            let lineText;
            if ((line.next == 45 || line.next == 58 || line.next == 124 /* '-:|' */) &&
                /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/.test(lineText = line.text.slice(line.pos))) {
                let firstRow = [], firstCount = parseRow(cx, leaf.content, 0, firstRow, leaf.start);
                if (firstCount == parseRow(cx, lineText, line.pos))
                    this.rows = [cx.elt("TableHeader", leaf.start, leaf.start + leaf.content.length, firstRow),
                        cx.elt("TableDelimiter", cx.lineStart + line.pos, cx.lineStart + line.text.length)];
            }
        }
        else if (this.rows) { // Line after the second
            let content = [];
            parseRow(cx, line.text, line.pos, content, cx.lineStart);
            this.rows.push(cx.elt("TableRow", cx.lineStart + line.pos, cx.lineStart + line.text.length, content));
        }
        return false;
    }
    finish(cx, leaf) {
        if (this.rows) {
            this.emit(cx, leaf);
            return true;
        }
        return false; // FIXME
    }
    emit(cx, leaf) {
        cx.addLeafElement(leaf, cx.elt("Table", leaf.start, leaf.start + leaf.content.length, this.rows));
    }
}
/// This extension provides
/// [GFM-style](https://github.github.com/gfm/#tables-extension-)
/// tables, using syntax like this:
///
/// ```
/// | head 1 | head 2 |
/// | ---    | ---    |
/// | cell 1 | cell 2 |
/// ```
const Table = {
    defineNodes: [
        { name: "Table", block: true },
        "TableHeader",
        "TableRow",
        "TableCell",
        "TableDelimiter"
    ],
    parseBlock: [{
            name: "Table",
            leaf(_, leaf) { return hasPipe(leaf.content, 0) ? new TableParser : null; },
            before: "SetextHeading"
        }]
};
class TaskParser {
    nextLine() { return false; }
    finish(cx, leaf) {
        cx.addLeafElement(leaf, cx.elt("Task", leaf.start, leaf.start + leaf.content.length, [
            cx.elt("TaskMarker", leaf.start, leaf.start + 3),
            ...cx.parser.parseInline(leaf.content.slice(3), leaf.start + 3)
        ]));
        return true;
    }
}
/// Extension providing
/// [GFM-style](https://github.github.com/gfm/#task-list-items-extension-)
/// task list items, where list items can be prefixed with `[ ]` or
/// `[x]` to add a checkbox.
const TaskList = {
    defineNodes: [
        { name: "Task", block: true },
        "TaskMarker"
    ],
    parseBlock: [{
            name: "TaskList",
            leaf(cx, leaf) {
                return /^\[[ xX]\]/.test(leaf.content) && cx.parser.nodeSet.types[cx.block.type].name == "ListItem" ? new TaskParser : null;
            },
            after: "SetextHeading"
        }]
};
/// Extension bundle containing [`Table`](#Table),
/// [`TaskList`](#TaskList) and [`Strikethrough`](#Strikethrough).
const GFM = [Table, TaskList, Strikethrough];
function parseSubSuper(ch, node, mark) {
    return (cx, next, pos) => {
        if (next != ch || cx.char(pos + 1) == ch)
            return -1;
        let elts = [cx.elt(mark, pos, pos + 1)];
        for (let i = pos + 1; i < cx.end; i++) {
            let next = cx.char(i);
            if (next == ch)
                return cx.addElement(cx.elt(node, pos, i + 1, elts.concat(cx.elt(mark, i, i + 1))));
            if (next == 92 /* '\\' */)
                elts.push(cx.elt("Escape", i, i++ + 2));
            if (space(next))
                break;
        }
        return -1;
    };
}
/// Extension providing
/// [Pandoc-style](https://pandoc.org/MANUAL.html#superscripts-and-subscripts)
/// superscript using `^` markers.
const Superscript = {
    defineNodes: ["Superscript", "SuperscriptMark"],
    parseInline: [{
            name: "Superscript",
            parse: parseSubSuper(94 /* '^' */, "Superscript", "SuperscriptMark")
        }]
};
/// Extension providing
/// [Pandoc-style](https://pandoc.org/MANUAL.html#superscripts-and-subscripts)
/// subscript using `~` markers.
const Subscript = {
    defineNodes: ["Subscript", "SubscriptMark"],
    parseInline: [{
            name: "Subscript",
            parse: parseSubSuper(126 /* '~' */, "Subscript", "SubscriptMark")
        }]
};
/// Extension that parses two colons with only letters, underscores,
/// and numbers between them as `Emoji` nodes.
const Emoji = {
    defineNodes: ["Emoji"],
    parseInline: [{
            name: "Emoji",
            parse(cx, next, pos) {
                let match;
                if (next != 58 /* ':' */ || !(match = /^[a-zA-Z_0-9]+:/.exec(cx.slice(pos + 1, cx.end))))
                    return -1;
                return cx.addElement(cx.elt("Emoji", pos, pos + 1 + match[0].length));
            }
        }]
};

export { BlockContext, Element, Emoji, GFM, InlineContext, LeafBlock, Line, MarkdownParser, Strikethrough, Subscript, Superscript, Table, TaskList, parser };
