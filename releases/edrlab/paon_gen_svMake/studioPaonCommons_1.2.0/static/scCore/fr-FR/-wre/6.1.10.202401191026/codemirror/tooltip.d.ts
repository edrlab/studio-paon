import { EditorView, ViewUpdate } from  './view';
import { Facet, Extension } from  './state';

/**
Describes a tooltip. Values of this type, when provided through
the [`showTooltip`](https://codemirror.net/6/docs/ref/#tooltip.showTooltip) facet, control the
individual tooltips on the editor.
*/
interface Tooltip {
    /**
    The document position at which to show the tooltip.
    */
    pos: number;
    /**
    The end of the range annotated by this tooltip, if different
    from `pos`.
    */
    end?: number;
    /**
    A constructor function that creates the tooltip's [DOM
    representation](https://codemirror.net/6/docs/ref/#tooltip.TooltipView).
    */
    create(view: EditorView): TooltipView;
    /**
    Whether the tooltip should be shown above or below the target
    position. Defaults to false.
    */
    above?: boolean;
    /**
    Whether the `above` option should be honored when there isn't
    enough space on that side to show the tooltip inside the
    viewport. Defaults to false.
    */
    strictSide?: boolean;
}
/**
Describes the way a tooltip is displayed.
*/
interface TooltipView {
    /**
    The DOM element to position over the editor.
    */
    dom: HTMLElement;
    /**
    Called after the tooltip is added to the DOM for the first time.
    */
    mount?(view: EditorView): void;
    /**
    Update the DOM element for a change in the view's state.
    */
    update?(update: ViewUpdate): void;
    /**
    Called when the tooltip has been (re)positioned.
    */
    positioned?(): void;
}
/**
Behavior by which an extension can provide a tooltip to be shown.
*/
declare const showTooltip: Facet<Tooltip | null, readonly (Tooltip | null)[]>;
/**
Enable a hover tooltip, which shows up when the pointer hovers
over ranges of text. The callback is called when the mouse hovers
over the document text. It should, if there is a tooltip
associated with position `pos` return the tooltip description
(either directly or in a promise). The `side` argument indicates
on which side of the position the pointer is—it will be -1 if the
pointer is before the position, 1 if after the position.
*/
declare function hoverTooltip(source: (view: EditorView, pos: number, side: -1 | 1) => Tooltip | null | Promise<Tooltip | null>, options?: {
    hideOnChange?: boolean;
}): Extension;

export { Tooltip, TooltipView, hoverTooltip, showTooltip };
