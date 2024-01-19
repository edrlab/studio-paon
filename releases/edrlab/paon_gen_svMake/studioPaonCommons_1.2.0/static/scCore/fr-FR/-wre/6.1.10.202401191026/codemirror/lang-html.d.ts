import * as _codemirror_state from  './state';
import { LezerLanguage, LanguageSupport } from  './language';

/**
A language provider based on the [Lezer HTML
parser](https://github.com/lezer-parser/html), wired up with the
JavaScript and CSS parsers to parse the content of `<script>` and
`<style>` tags.
*/
declare const htmlLanguage: LezerLanguage;
/**
HTML tag completion. Opens and closes tags and attributes in a
context-aware way.
*/
declare const htmlCompletion: _codemirror_state.Extension;
/**
Language support for HTML, including
[`htmlCompletion`](https://codemirror.net/6/docs/ref/#lang-html.htmlCompletion) and JavaScript and
CSS support extensions.
*/
declare function html(): LanguageSupport;

export { html, htmlCompletion, htmlLanguage };
