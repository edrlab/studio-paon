import { LezerLanguage, LanguageSupport } from  './language';

declare const cppLanguage: LezerLanguage;
declare function cpp(): LanguageSupport;

export { cpp, cppLanguage };
