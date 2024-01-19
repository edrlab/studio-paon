import { LezerLanguage, LanguageSupport } from  './language';
import { Diagnostic } from  './lint';
import { EditorView } from  './view';

declare const jsonParseLinter: () => (view: EditorView) => Diagnostic[];

declare const jsonLanguage: LezerLanguage;
declare function json(): LanguageSupport;

export { json, jsonLanguage, jsonParseLinter };
