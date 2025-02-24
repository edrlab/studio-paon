import { StateCommand } from  './state';
import { Command, KeyBinding } from  './view';

/**
Move the selection one character to the left (which is backward in
left-to-right text, forward in right-to-left text).
*/
declare const cursorCharLeft: Command;
/**
Move the selection one character to the right.
*/
declare const cursorCharRight: Command;
/**
Move the selection one character forward.
*/
declare const cursorCharForward: Command;
/**
Move the selection one character backward.
*/
declare const cursorCharBackward: Command;
/**
Move the selection across one group of word or non-word (but also
non-space) characters.
*/
declare const cursorGroupLeft: Command;
/**
Move the selection one group to the right.
*/
declare const cursorGroupRight: Command;
/**
Move the selection one group forward.
*/
declare const cursorGroupForward: Command;
/**
Move the selection one group backward.
*/
declare const cursorGroupBackward: Command;
/**
Move the cursor over the next syntactic element to the left.
*/
declare const cursorSyntaxLeft: Command;
/**
Move the cursor over the next syntactic element to the right.
*/
declare const cursorSyntaxRight: Command;
/**
Move the selection one line up.
*/
declare const cursorLineUp: Command;
/**
Move the selection one line down.
*/
declare const cursorLineDown: Command;
/**
Move the selection one page up.
*/
declare const cursorPageUp: Command;
/**
Move the selection one page down.
*/
declare const cursorPageDown: Command;
/**
Move the selection to the next line wrap point, or to the end of
the line if there isn't one left on this line.
*/
declare const cursorLineBoundaryForward: Command;
/**
Move the selection to previous line wrap point, or failing that to
the start of the line. If the line is indented, and the cursor
isn't already at the end of the indentation, this will move to the
end of the indentation instead of the start of the line.
*/
declare const cursorLineBoundaryBackward: Command;
/**
Move the selection to the start of the line.
*/
declare const cursorLineStart: Command;
/**
Move the selection to the end of the line.
*/
declare const cursorLineEnd: Command;
/**
Move the selection to the bracket matching the one it is currently
on, if any.
*/
declare const cursorMatchingBracket: StateCommand;
/**
Extend the selection to the bracket matching the one the selection
head is currently on, if any.
*/
declare const selectMatchingBracket: StateCommand;
/**
Move the selection head one character to the left, while leaving
the anchor in place.
*/
declare const selectCharLeft: Command;
/**
Move the selection head one character to the right.
*/
declare const selectCharRight: Command;
/**
Move the selection head one character forward.
*/
declare const selectCharForward: Command;
/**
Move the selection head one character backward.
*/
declare const selectCharBackward: Command;
/**
Move the selection head one [group](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) to
the left.
*/
declare const selectGroupLeft: Command;
/**
Move the selection head one group to the right.
*/
declare const selectGroupRight: Command;
/**
Move the selection head one group forward.
*/
declare const selectGroupForward: Command;
/**
Move the selection head one group backward.
*/
declare const selectGroupBackward: Command;
/**
Move the selection head over the next syntactic element to the left.
*/
declare const selectSyntaxLeft: Command;
/**
Move the selection head over the next syntactic element to the right.
*/
declare const selectSyntaxRight: Command;
/**
Move the selection head one line up.
*/
declare const selectLineUp: Command;
/**
Move the selection head one line down.
*/
declare const selectLineDown: Command;
/**
Move the selection head one page up.
*/
declare const selectPageUp: Command;
/**
Move the selection head one page down.
*/
declare const selectPageDown: Command;
/**
Move the selection head to the next line boundary.
*/
declare const selectLineBoundaryForward: Command;
/**
Move the selection head to the previous line boundary.
*/
declare const selectLineBoundaryBackward: Command;
/**
Move the selection head to the start of the line.
*/
declare const selectLineStart: Command;
/**
Move the selection head to the end of the line.
*/
declare const selectLineEnd: Command;
/**
Move the selection to the start of the document.
*/
declare const cursorDocStart: StateCommand;
/**
Move the selection to the end of the document.
*/
declare const cursorDocEnd: StateCommand;
/**
Move the selection head to the start of the document.
*/
declare const selectDocStart: StateCommand;
/**
Move the selection head to the end of the document.
*/
declare const selectDocEnd: StateCommand;
/**
Select the entire document.
*/
declare const selectAll: StateCommand;
/**
Expand the selection to cover entire lines.
*/
declare const selectLine: StateCommand;
/**
Select the next syntactic construct that is larger than the
selection. Note that this will only work insofar as the language
[provider](https://codemirror.net/6/docs/ref/#language.language) you use builds up a full
syntax tree.
*/
declare const selectParentSyntax: StateCommand;
/**
Simplify the current selection. When multiple ranges are selected,
reduce it to its main range. Otherwise, if the selection is
non-empty, convert it to a cursor selection.
*/
declare const simplifySelection: StateCommand;
/**
Delete the selection, or, for cursor selections, the code point
before the cursor.
*/
declare const deleteCodePointBackward: Command;
/**
Delete the selection, or, for cursor selections, the code point
after the cursor.
*/
declare const deleteCodePointForward: Command;
/**
Delete the selection, or, for cursor selections, the character
before the cursor.
*/
declare const deleteCharBackward: Command;
/**
Delete the selection or the character after the cursor.
*/
declare const deleteCharForward: Command;
/**
Delete the selection or backward until the end of the next
[group](https://codemirror.net/6/docs/ref/#view.EditorView.moveByGroup), only skipping groups of
whitespace when they consist of a single space.
*/
declare const deleteGroupBackward: StateCommand;
/**
Delete the selection or forward until the end of the next group.
*/
declare const deleteGroupForward: StateCommand;
/**
Delete the selection, or, if it is a cursor selection, delete to
the end of the line. If the cursor is directly at the end of the
line, delete the line break after it.
*/
declare const deleteToLineEnd: Command;
/**
Delete the selection, or, if it is a cursor selection, delete to
the start of the line. If the cursor is directly at the start of the
line, delete the line break before it.
*/
declare const deleteToLineStart: Command;
/**
Delete all whitespace directly before a line end from the
document.
*/
declare const deleteTrailingWhitespace: StateCommand;
/**
Replace each selection range with a line break, leaving the cursor
on the line before the break.
*/
declare const splitLine: StateCommand;
/**
Flip the characters before and after the cursor(s).
*/
declare const transposeChars: StateCommand;
/**
Move the selected lines up one line.
*/
declare const moveLineUp: StateCommand;
/**
Move the selected lines down one line.
*/
declare const moveLineDown: StateCommand;
/**
Create a copy of the selected lines. Keep the selection in the top copy.
*/
declare const copyLineUp: StateCommand;
/**
Create a copy of the selected lines. Keep the selection in the bottom copy.
*/
declare const copyLineDown: StateCommand;
/**
Delete selected lines.
*/
declare const deleteLine: Command;
/**
Replace the selection with a newline.
*/
declare const insertNewline: StateCommand;
/**
Replace the selection with a newline and indent the newly created
line(s). If the current line consists only of whitespace, this
will also delete that whitespace. When the cursor is between
matching brackets, an additional newline will be inserted after
the cursor.
*/
declare const insertNewlineAndIndent: StateCommand;
/**
Auto-indent the selected lines. This uses the [indentation service
facet](https://codemirror.net/6/docs/ref/#language.indentService) as source for auto-indent
information.
*/
declare const indentSelection: StateCommand;
/**
Add a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation to all selected
lines.
*/
declare const indentMore: StateCommand;
/**
Remove a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation from all
selected lines.
*/
declare const indentLess: StateCommand;
/**
Insert a tab character at the cursor or, if something is selected,
use [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore) to indent the entire
selection.
*/
declare const insertTab: StateCommand;
/**
Array of key bindings containing the Emacs-style bindings that are
available on macOS by default.

 - Ctrl-b: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
 - Ctrl-f: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
 - Ctrl-p: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
 - Ctrl-n: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
 - Ctrl-a: [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
 - Ctrl-e: [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
 - Ctrl-d: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
 - Ctrl-h: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
 - Ctrl-k: [`deleteToLineEnd`](https://codemirror.net/6/docs/ref/#commands.deleteToLineEnd)
 - Alt-d: [`deleteGroupForward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupForward)
 - Ctrl-Alt-h: [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
 - Ctrl-o: [`splitLine`](https://codemirror.net/6/docs/ref/#commands.splitLine)
 - Ctrl-t: [`transposeChars`](https://codemirror.net/6/docs/ref/#commands.transposeChars)
 - Alt-f: [`cursorGroupForward`](https://codemirror.net/6/docs/ref/#commands.cursorGroupForward) ([`selectGroupForward`](https://codemirror.net/6/docs/ref/#commands.selectGroupForward) with Shift)
 - Alt-b: [`cursorGroupBackward`](https://codemirror.net/6/docs/ref/#commands.cursorGroupBackward) ([`selectGroupBackward`](https://codemirror.net/6/docs/ref/#commands.selectGroupBackward) with Shift)
 - Alt-<: [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart)
 - Alt->: [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd)
 - Ctrl-v: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown)
 - Alt-v: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp)
*/
declare const emacsStyleKeymap: readonly KeyBinding[];
/**
An array of key bindings closely sticking to platform-standard or
widely used bindings. (This includes the bindings from
[`emacsStyleKeymap`](https://codemirror.net/6/docs/ref/#commands.emacsStyleKeymap), with their `key`
property changed to `mac`.)

 - ArrowLeft: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
 - ArrowRight: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
 - Ctrl-ArrowLeft (Alt-ArrowLeft on macOS): [`cursorGroupLeft`](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) ([`selectGroupLeft`](https://codemirror.net/6/docs/ref/#commands.selectGroupLeft) with Shift)
 - Ctrl-ArrowRight (Alt-ArrowRight on macOS): [`cursorGroupRight`](https://codemirror.net/6/docs/ref/#commands.cursorGroupRight) ([`selectGroupRight`](https://codemirror.net/6/docs/ref/#commands.selectGroupRight) with Shift)
 - Cmd-ArrowLeft (on macOS): [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
 - Cmd-ArrowRight (on macOS): [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
 - ArrowUp: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
 - ArrowDown: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
 - Cmd-ArrowUp (on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
 - Cmd-ArrowDown (on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
 - Ctrl-ArrowUp (on macOS): [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
 - Ctrl-ArrowDown (on macOS): [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
 - PageUp: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
 - PageDown: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
 - Home: [`cursorLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryBackward) ([`selectLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryBackward) with Shift)
 - End: [`cursorLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryForward) ([`selectLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryForward) with Shift)
 - Ctrl-Home (Cmd-Home on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
 - Ctrl-End (Cmd-Home on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
 - Enter: [`insertNewlineAndIndent`](https://codemirror.net/6/docs/ref/#commands.insertNewlineAndIndent)
 - Ctrl-a (Cmd-a on macOS): [`selectAll`](https://codemirror.net/6/docs/ref/#commands.selectAll)
 - Backspace: [`deleteCodePointBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCodePointBackward)
 - Delete: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
 - Ctrl-Backspace (Alt-Backspace on macOS): [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
 - Ctrl-Delete (Alt-Delete on macOS): [`deleteGroupForward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupForward)
 - Cmd-Backspace (macOS): [`deleteToLineStart`](https://codemirror.net/6/docs/ref/#commands.deleteToLineStart).
 - Cmd-Delete (macOS): [`deleteToLineEnd`](https://codemirror.net/6/docs/ref/#commands.deleteToLineEnd).
*/
declare const standardKeymap: readonly KeyBinding[];
/**
The default keymap. Includes all bindings from
[`standardKeymap`](https://codemirror.net/6/docs/ref/#commands.standardKeymap) plus the following:

- Alt-ArrowLeft (Ctrl-ArrowLeft on macOS): [`cursorSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxLeft) ([`selectSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxLeft) with Shift)
- Alt-ArrowRight (Ctrl-ArrowRight on macOS): [`cursorSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxRight) ([`selectSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxRight) with Shift)
- Alt-ArrowUp: [`moveLineUp`](https://codemirror.net/6/docs/ref/#commands.moveLineUp)
- Alt-ArrowDown: [`moveLineDown`](https://codemirror.net/6/docs/ref/#commands.moveLineDown)
- Shift-Alt-ArrowUp: [`copyLineUp`](https://codemirror.net/6/docs/ref/#commands.copyLineUp)
- Shift-Alt-ArrowDown: [`copyLineDown`](https://codemirror.net/6/docs/ref/#commands.copyLineDown)
- Escape: [`simplifySelection`](https://codemirror.net/6/docs/ref/#commands.simplifySelection)
- Alt-l (Ctrl-l on macOS): [`selectLine`](https://codemirror.net/6/docs/ref/#commands.selectLine)
- Ctrl-i (Cmd-i on macOS): [`selectParentSyntax`](https://codemirror.net/6/docs/ref/#commands.selectParentSyntax)
- Ctrl-[ (Cmd-[ on macOS): [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess)
- Ctrl-] (Cmd-] on macOS): [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore)
- Ctrl-Alt-\\ (Cmd-Alt-\\ on macOS): [`indentSelection`](https://codemirror.net/6/docs/ref/#commands.indentSelection)
- Shift-Ctrl-k (Shift-Cmd-k on macOS): [`deleteLine`](https://codemirror.net/6/docs/ref/#commands.deleteLine)
- Shift-Ctrl-\\ (Shift-Cmd-\\ on macOS): [`cursorMatchingBracket`](https://codemirror.net/6/docs/ref/#commands.cursorMatchingBracket)
*/
declare const defaultKeymap: readonly KeyBinding[];
/**
A binding that binds Tab to [`insertTab`](https://codemirror.net/6/docs/ref/#commands.insertTab) and
Shift-Tab to [`indentSelection`](https://codemirror.net/6/docs/ref/#commands.indentSelection).
Please see the [Tab example](../../examples/tab/) before using
this.
*/
declare const defaultTabBinding: KeyBinding;

export { copyLineDown, copyLineUp, cursorCharBackward, cursorCharForward, cursorCharLeft, cursorCharRight, cursorDocEnd, cursorDocStart, cursorGroupBackward, cursorGroupForward, cursorGroupLeft, cursorGroupRight, cursorLineBoundaryBackward, cursorLineBoundaryForward, cursorLineDown, cursorLineEnd, cursorLineStart, cursorLineUp, cursorMatchingBracket, cursorPageDown, cursorPageUp, cursorSyntaxLeft, cursorSyntaxRight, defaultKeymap, defaultTabBinding, deleteCharBackward, deleteCharForward, deleteCodePointBackward, deleteCodePointForward, deleteGroupBackward, deleteGroupForward, deleteLine, deleteToLineEnd, deleteToLineStart, deleteTrailingWhitespace, emacsStyleKeymap, indentLess, indentMore, indentSelection, insertNewline, insertNewlineAndIndent, insertTab, moveLineDown, moveLineUp, selectAll, selectCharBackward, selectCharForward, selectCharLeft, selectCharRight, selectDocEnd, selectDocStart, selectGroupBackward, selectGroupForward, selectGroupLeft, selectGroupRight, selectLine, selectLineBoundaryBackward, selectLineBoundaryForward, selectLineDown, selectLineEnd, selectLineStart, selectLineUp, selectMatchingBracket, selectPageDown, selectPageUp, selectParentSyntax, selectSyntaxLeft, selectSyntaxRight, simplifySelection, splitLine, standardKeymap, transposeChars };
