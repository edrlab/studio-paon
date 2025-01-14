import { Tree, TreeBuffer, TreeFragment, NodeSet, NodeType, NodePropSource, Input, PartialParse, ParseContext } from  './lezer-tree';
import { Stack } from  './lezer_stack';
import { Token, Tokenizer, ExternalTokenizer } from  './lezer_token';
export declare type NestedParserSpec = {
    startParse?: (input: Input, startPos: number, context: ParseContext) => PartialParse;
    wrapType?: NodeType | number;
    filterEnd?(endToken: string): boolean;
};
export declare type NestedParser = NestedParserSpec | ((input: Input, stack: Stack) => NestedParserSpec | null);
declare class FragmentCursor {
    readonly fragments: readonly TreeFragment[];
    i: number;
    fragment: TreeFragment | null;
    safeFrom: number;
    safeTo: number;
    trees: Tree[];
    start: number[];
    index: number[];
    nextStart: number;
    constructor(fragments: readonly TreeFragment[]);
    nextFragment(): void;
    nodeAt(pos: number): Tree | TreeBuffer | null;
}
declare class CachedToken extends Token {
    extended: number;
    mask: number;
    context: number;
    clear(start: number): void;
}
declare class TokenCache {
    tokens: CachedToken[];
    mainToken: Token;
    actions: number[];
    constructor(parser: Parser);
    getActions(stack: Stack, input: Input): number[];
    updateCachedToken(token: CachedToken, tokenizer: Tokenizer, stack: Stack, input: Input): void;
    putAction(action: number, token: number, end: number, index: number): number;
    addActions(stack: Stack, token: number, end: number, index: number): number;
}
export declare class Parse implements PartialParse {
    parser: Parser;
    input: Input;
    startPos: number;
    context: ParseContext;
    stacks: Stack[];
    pos: number;
    recovering: number;
    fragments: FragmentCursor | null;
    nextStackID: number;
    nested: PartialParse | null;
    nestEnd: number;
    nestWrap: NodeType | null;
    reused: (Tree | TreeBuffer)[];
    tokens: TokenCache;
    topTerm: number;
    constructor(parser: Parser, input: Input, startPos: number, context: ParseContext);
    advance(): Tree;
    private advanceStack;
    private advanceFully;
    private runRecovery;
    forceFinish(): Tree;
    stackToTree(stack: Stack, pos?: number): Tree;
    private checkNest;
    private startNested;
    private scanForNestEnd;
    private finishNested;
    private stackID;
}
export declare class Dialect {
    readonly source: string | undefined;
    readonly flags: readonly boolean[];
    readonly disabled: null | Uint8Array;
    constructor(source: string | undefined, flags: readonly boolean[], disabled: null | Uint8Array);
    allows(term: number): boolean;
}
export declare class ContextTracker<T> {
    constructor(spec: {
        start: T;
        shift?(context: T, term: number, input: Input, stack: Stack): T;
        reduce?(context: T, term: number, input: Input, stack: Stack): T;
        reuse?(context: T, node: Tree | TreeBuffer, input: Input, stack: Stack): T;
        hash(context: T): number;
        strict?: boolean;
    });
}
export interface ParserConfig {
    props?: readonly NodePropSource[];
    top?: string;
    dialect?: string;
    nested?: {
        [name: string]: NestedParser;
    };
    tokenizers?: {
        from: ExternalTokenizer;
        to: ExternalTokenizer;
    }[];
    strict?: boolean;
    bufferLength?: number;
}
export declare class Parser {
    readonly nodeSet: NodeSet;
    private cachedDialect;
    parse(input: Input | string, startPos?: number, context?: ParseContext): Tree;
    startParse(input: Input | string, startPos?: number, context?: ParseContext): PartialParse;
    configure(config: ParserConfig): Parser;
    getName(term: number): string;
    get hasNested(): boolean;
    get topNode(): NodeType;
}
export {};
