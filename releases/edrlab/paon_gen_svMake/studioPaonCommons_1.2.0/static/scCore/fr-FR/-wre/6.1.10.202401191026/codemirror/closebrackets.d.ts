import { KeyBinding } from  './view';
import { Extension, StateCommand, EditorState, Transaction } from  './state';

interface CloseBracketConfig {
    brackets?: string[];
    before?: string;
}
declare function closeBrackets(): Extension;
declare const deleteBracketPair: StateCommand;
declare const closeBracketsKeymap: readonly KeyBinding[];
declare function insertBracket(state: EditorState, bracket: string): Transaction | null;

export { CloseBracketConfig, closeBrackets, closeBracketsKeymap, deleteBracketPair, insertBracket };
