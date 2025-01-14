import * as _codemirror_state from  './state';
import { EditorState, Extension } from  './state';
import { DecorationSet, Command, KeyBinding } from  './view';

declare type DocRange = {
    from: number;
    to: number;
};
/**
State effect that can be attached to a transaction to fold the
given range. (You probably only need this in exceptional
circumstances—usually you'll just want to let
[`foldCode`](https://codemirror.net/6/docs/ref/#fold.foldCode) and the [fold
gutter](https://codemirror.net/6/docs/ref/#fold.foldGutter) create the transactions.)
*/
declare const foldEffect: _codemirror_state.StateEffectType<DocRange>;
/**
State effect that unfolds the given range (if it was folded).
*/
declare const unfoldEffect: _codemirror_state.StateEffectType<DocRange>;
/**
Get a [range set](https://codemirror.net/6/docs/ref/#rangeset.RangeSet) containing the folded ranges
in the given state.
*/
declare function foldedRanges(state: EditorState): DecorationSet;
/**
Fold the lines that are selected, if possible.
*/
declare const foldCode: Command;
/**
Unfold folded ranges on selected lines.
*/
declare const unfoldCode: Command;
/**
Fold all top-level foldable ranges.
*/
declare const foldAll: Command;
/**
Unfold all folded code.
*/
declare const unfoldAll: Command;
/**
Default fold-related key bindings.

 - Ctrl-Shift-[ (Cmd-Alt-[ on macOS): [`foldCode`](https://codemirror.net/6/docs/ref/#fold.foldCode).
 - Ctrl-Shift-] (Cmd-Alt-] on macOS): [`unfoldCode`](https://codemirror.net/6/docs/ref/#fold.unfoldCode).
 - Ctrl-Alt-[: [`foldAll`](https://codemirror.net/6/docs/ref/#fold.foldAll).
 - Ctrl-Alt-]: [`unfoldAll`](https://codemirror.net/6/docs/ref/#fold.unfoldAll).
*/
declare const foldKeymap: readonly KeyBinding[];
interface FoldConfig {
    /**
    A function that creates the DOM element used to indicate the
    position of folded code. When not given, the `placeholderText`
    option will be used instead.
    */
    placeholderDOM?: (() => HTMLElement) | null;
    /**
    Text to use as placeholder for folded text. Defaults to `"…"`.
    Will be styled with the `"cm-foldPlaceholder"` class.
    */
    placeholderText?: string;
}
/**
Create an extension that configures code folding.
*/
declare function codeFolding(config?: FoldConfig): Extension;
interface FoldGutterConfig {
    /**
    Text used to indicate that a given line can be folded. Defaults
    to `"⌄"`.
    */
    openText?: string;
    /**
    Text used to indicate that a given line is folded. Defaults to
    `"›"`.
    */
    closedText?: string;
}
/**
Create an extension that registers a fold gutter, which shows a
fold status indicator before foldable lines (which can be clicked
to fold or unfold the line).
*/
declare function foldGutter(config?: FoldGutterConfig): Extension;

export { codeFolding, foldAll, foldCode, foldEffect, foldGutter, foldKeymap, foldedRanges, unfoldAll, unfoldCode, unfoldEffect };
