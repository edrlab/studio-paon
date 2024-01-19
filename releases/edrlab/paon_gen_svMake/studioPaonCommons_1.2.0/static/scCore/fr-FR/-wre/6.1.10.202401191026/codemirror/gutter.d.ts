import * as _codemirror_rangeset from  './rangeset';
import { RangeValue, RangeSet } from  './rangeset';
import { EditorView, BlockInfo, ViewUpdate } from  './view';
import { Extension, Facet, EditorState } from  './state';

/**
A gutter marker represents a bit of information attached to a line
in a specific gutter. Your own custom markers have to extend this
class.
*/
declare abstract class GutterMarker extends RangeValue {
    /**
    Compare this marker to another marker of the same type.
    */
    abstract eq(other: GutterMarker): boolean;
    /**
    Render the DOM node for this marker, if any.
    */
    toDOM(_view: EditorView): Node | null;
    /**
    Create a range that places this marker at the given position.
    */
    at(pos: number): _codemirror_rangeset.Range<this>;
    /**
    This property can be used to add CSS classes to the gutter
    element that contains this marker.
    */
    elementClass: string;
}
declare type Handlers = {
    [event: string]: (view: EditorView, line: BlockInfo, event: any) => boolean;
};
interface GutterConfig {
    /**
    An extra CSS class to be added to the wrapper (`cm-gutter`)
    element.
    */
    class?: string;
    /**
    Controls whether empty gutter elements should be rendered.
    Defaults to false.
    */
    renderEmptyElements?: boolean;
    /**
    Retrieve a set of markers to use in this gutter from the
    current editor state.
    */
    markers?: (view: EditorView) => (RangeSet<GutterMarker> | readonly RangeSet<GutterMarker>[]);
    /**
    Can be used to optionally add a single marker to every line.
    */
    lineMarker?: (view: EditorView, line: BlockInfo, otherMarkers: readonly GutterMarker[]) => GutterMarker | null;
    /**
    Add a hidden spacer element that gives the gutter its base
    width.
    */
    initialSpacer?: null | ((view: EditorView) => GutterMarker);
    /**
    Update the spacer element when the view is updated.
    */
    updateSpacer?: null | ((spacer: GutterMarker, update: ViewUpdate) => GutterMarker);
    /**
    Supply event handlers for DOM events on this gutter.
    */
    domEventHandlers?: Handlers;
}
/**
Define an editor gutter. The order in which the gutters appear is
determined by their extension priority.
*/
declare function gutter(config: GutterConfig): Extension;
/**
The gutter-drawing plugin is automatically enabled when you add a
gutter, but you can use this function to explicitly configure it.

Unless `fixed` is explicitly set to `false`, the gutters are
fixed, meaning they don't scroll along with the content
horizontally (except on Internet Explorer, which doesn't support
CSS [`position:
sticky`](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky)).
*/
declare function gutters(config?: {
    fixed?: boolean;
}): Extension;
interface LineNumberConfig {
    /**
    How to display line numbers. Defaults to simply converting them
    to string.
    */
    formatNumber?: (lineNo: number, state: EditorState) => string;
    /**
    Supply event handlers for DOM events on this gutter.
    */
    domEventHandlers?: Handlers;
}
/**
Facet used to provide markers to the line number gutter.
*/
declare const lineNumberMarkers: Facet<RangeSet<GutterMarker>, readonly RangeSet<GutterMarker>[]>;
/**
Create a line number gutter extension.
*/
declare function lineNumbers(config?: LineNumberConfig): Extension;

export { GutterMarker, gutter, gutters, lineNumberMarkers, lineNumbers };
