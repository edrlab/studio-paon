import { LezerLanguage, LanguageSupport } from  './language';
import { Completion, CompletionSource } from  './autocomplete';

interface ElementSpec {
    name: string;
    children?: readonly string[];
    textContent?: readonly string[];
    top?: boolean;
    attributes?: readonly (string | AttrSpec)[];
    completion?: Partial<Completion>;
}
interface AttrSpec {
    name: string;
    values?: readonly (string | Completion)[];
    global?: boolean;
    completion?: Partial<Completion>;
}
declare function completeFromSchema(eltSpecs: readonly ElementSpec[], attrSpecs: readonly AttrSpec[]): CompletionSource;

declare const xmlLanguage: LezerLanguage;
declare type XMLConfig = {
    elements?: readonly ElementSpec[];
    attributes?: readonly AttrSpec[];
};
declare function xml(conf?: XMLConfig): LanguageSupport;

export { AttrSpec, ElementSpec, completeFromSchema, xml, xmlLanguage };
