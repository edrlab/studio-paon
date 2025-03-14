import { Input } from  './lezer-tree';
import { Stack } from  './lezer_stack';
export declare class Token {
    start: number;
    value: number;
    end: number;
    accept(value: number, end: number): void;
}
export interface Tokenizer {
    token(input: Input, token: Token, stack: Stack): void;
    contextual: boolean;
    fallback: boolean;
    extend: boolean;
}
interface ExternalOptions {
    contextual?: boolean;
    fallback?: boolean;
    extend?: boolean;
}
export declare class ExternalTokenizer {
    constructor(token: (input: Input, token: Token, stack: Stack) => void, options?: ExternalOptions);
}
export {};
