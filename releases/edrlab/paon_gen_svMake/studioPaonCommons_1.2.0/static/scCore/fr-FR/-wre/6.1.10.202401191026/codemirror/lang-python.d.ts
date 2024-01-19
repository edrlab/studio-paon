import { LezerLanguage, LanguageSupport } from  './language';

declare const pythonLanguage: LezerLanguage;
declare function python(): LanguageSupport;

export { python, pythonLanguage };
