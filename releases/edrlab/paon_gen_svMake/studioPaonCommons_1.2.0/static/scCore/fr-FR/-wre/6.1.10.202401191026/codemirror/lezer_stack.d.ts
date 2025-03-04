import { BufferCursor } from  './lezer-tree';
export declare class Stack {
    pos: number;
    get context(): any;
    canShift(term: number): boolean;
    get ruleStart(): number;
    startOf(types: readonly number[], before?: number): number;
    get parser(): import('./lezer_parse').Parser;
    dialectEnabled(dialectID: number): boolean;
    private shiftContext;
    private reduceContext;
    private updateContext;
}
export declare const enum Recover {
    Token = 200,
    Reduce = 100,
    MaxNext = 4,
    MaxInsertStackDepth = 300,
    DampenInsertStackDepth = 120
}
export declare class StackBufferCursor implements BufferCursor {
    stack: Stack;
    pos: number;
    index: number;
    buffer: number[];
    constructor(stack: Stack, pos: number, index: number);
    static create(stack: Stack): StackBufferCursor;
    maybeNext(): void;
    get id(): number;
    get start(): number;
    get end(): number;
    get size(): number;
    next(): void;
    fork(): StackBufferCursor;
}
