import { LezerLanguage, LanguageSupport } from  './language';
import { Extension } from  './state';

declare const cssLanguage: LezerLanguage;
declare const cssCompletion: Extension;
declare function css(): LanguageSupport;

export { css, cssCompletion, cssLanguage };
