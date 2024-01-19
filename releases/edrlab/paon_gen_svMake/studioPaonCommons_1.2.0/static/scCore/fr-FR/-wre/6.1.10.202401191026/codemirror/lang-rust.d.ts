import { LezerLanguage, LanguageSupport } from  './language';

declare const rustLanguage: LezerLanguage;
declare function rust(): LanguageSupport;

export { rust, rustLanguage };
