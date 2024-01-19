import { Tree, TreeBuffer, NodePropSource, NodeSet, Input, PartialParse, ParseContext } from  './lezer-tree';
export declare class LeafBlock {
    readonly start: number;
    content: string;
}
export declare class Line {
    text: string;
    baseIndent: number;
    basePos: number;
    pos: number;
    indent: number;
    next: number;
    skipSpace(from: number): number;
    moveBase(to: number): void;
    moveBaseColumn(indent: number): void;
    addMarker(elt: Element): void;
    countIndent(to: number, from?: number, indent?: number): number;
    findColumn(goal: number): number;
}
export declare function space(ch: number): boolean;
declare type BlockResult = boolean | null;
export declare class BlockContext implements PartialParse {
    readonly parser: MarkdownParser;
    private line;
    private atEnd;
    private fragments;
    private nested;
    lineStart: number;
    get pos(): number;
    advance(): Tree;
    private reuseFragment;
    nextLine(): boolean;
    prevLineEnd(): number;
    startComposite(type: string, start: number, value?: number): void;
    addElement(elt: Element): void;
    addLeafElement(leaf: LeafBlock, elt: Element): void;
    startNested(from: number, parse: PartialParse, finish: (tree: Tree) => Tree | Element): void;
    private finish;
    forceFinish(): Tree;
    elt(type: string, from: number, to: number, children?: readonly Element[]): Element;
    elt(tree: Tree | TreeBuffer, at: number): Element;
}
export declare type InnerParser = {
    startParse(input: Input, startPos: number, context: ParseContext): PartialParse;
};
export interface NodeSpec {
    name: string;
    block?: boolean;
    composite?(cx: BlockContext, line: Line, value: number): boolean;
}
export interface InlineParser {
    name: string;
    parse(cx: InlineContext, next: number, pos: number): number;
    before?: string;
    after?: string;
}
export interface BlockParser {
    name: string;
    parse?(cx: BlockContext, line: Line): BlockResult;
    leaf?(cx: BlockContext, leaf: LeafBlock): LeafBlockParser | null;
    endLeaf?(cx: BlockContext, line: Line): boolean;
    before?: string;
    after?: string;
}
export interface LeafBlockParser {
    nextLine(cx: BlockContext, line: Line, leaf: LeafBlock): boolean;
    finish(cx: BlockContext, leaf: LeafBlock): boolean;
}
export interface MarkdownConfig {
    props?: readonly NodePropSource[];
    codeParser?: (info: string) => null | InnerParser;
    htmlParser?: InnerParser;
    defineNodes?: readonly (string | NodeSpec)[];
    parseBlock?: readonly BlockParser[];
    parseInline?: readonly InlineParser[];
    remove?: readonly string[];
}
export declare type MarkdownExtension = MarkdownConfig | readonly MarkdownExtension[];
export declare class MarkdownParser {
    readonly nodeSet: NodeSet;
    startParse(input: Input, startPos?: number, parseContext?: ParseContext): PartialParse;
    configure(spec: MarkdownExtension): MarkdownParser;
    parseInline(text: string, offset: number): any[];
}
export declare class Element {
    readonly type: number;
    readonly from: number;
    readonly to: number;
}
export interface DelimiterType {
    resolve?: string;
    mark?: string;
}
export declare class InlineContext {
    readonly parser: MarkdownParser;
    readonly text: string;
    readonly offset: number;
    char(pos: number): number;
    get end(): number;
    slice(from: number, to: number): string;
    addDelimiter(type: DelimiterType, from: number, to: number, open: boolean, close: boolean): number;
    addElement(elt: Element): number;
    findOpeningDelimiter(type: DelimiterType): number;
    takeContent(startIndex: number): any[];
    skipSpace(from: number): number;
    elt(type: string, from: number, to: number, children?: readonly Element[]): Element;
    elt(tree: Tree | TreeBuffer, at: number): Element;
}
export declare const parser: MarkdownParser;
export {};
