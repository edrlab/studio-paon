import { Extension, EditorState } from  './state';

interface Config {
    afterCursor?: boolean;
    brackets?: string;
    maxScanDistance?: number;
}
declare function bracketMatching(config?: Config): Extension;
interface MatchResult {
    start: {
        from: number;
        to: number;
    };
    end?: {
        from: number;
        to: number;
    };
    matched: boolean;
}
declare function matchBrackets(state: EditorState, pos: number, dir: -1 | 1, config?: Config): MatchResult | null;

export { Config, MatchResult, bracketMatching, matchBrackets };
