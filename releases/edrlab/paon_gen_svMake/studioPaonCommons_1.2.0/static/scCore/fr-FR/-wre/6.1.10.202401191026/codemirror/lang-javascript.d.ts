import { LezerLanguage, LanguageSupport } from  './language';
import { Completion } from  './autocomplete';
import { Diagnostic } from  './lint';
import { EditorView } from  './view';

declare const javascriptLanguage: LezerLanguage;
declare const typescriptLanguage: LezerLanguage;
declare const jsxLanguage: LezerLanguage;
declare const tsxLanguage: LezerLanguage;
declare function javascript(config?: {
    jsx?: boolean;
    typescript?: boolean;
}): LanguageSupport;

declare const snippets: readonly Completion[];

declare function esLint(eslint: any, config?: any): (view: EditorView) => Diagnostic[];

export { esLint, javascript, javascriptLanguage, jsxLanguage, snippets, tsxLanguage, typescriptLanguage };
