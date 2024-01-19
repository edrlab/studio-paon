import { parser, configureNesting } from  './lezer-html.js';
import { cssLanguage, css } from  './lang-css.js';
import { javascriptLanguage, javascript } from  './lang-javascript.js';
import { syntaxTree, LezerLanguage, indentNodeProp, foldNodeProp, LanguageSupport } from  './language.js';
import { styleTags, tags } from  './highlight.js';

const Targets = ["_blank", "_self", "_top", "_parent"];
const Charsets = ["ascii", "utf-8", "utf-16", "latin1", "latin1"];
const Methods = ["get", "post", "put", "delete"];
const Encs = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"];
const Bool = ["true", "false"];
const S = {}; // Empty tag spec
const Tags = {
    a: {
        attrs: {
            href: null, ping: null, type: null,
            media: null,
            target: Targets,
            hreflang: null
        }
    },
    abbr: S,
    acronym: S,
    address: S,
    applet: S,
    area: {
        attrs: {
            alt: null, coords: null, href: null, target: null, ping: null,
            media: null, hreflang: null, type: null,
            shape: ["default", "rect", "circle", "poly"]
        }
    },
    article: S,
    aside: S,
    audio: {
        attrs: {
            src: null, mediagroup: null,
            crossorigin: ["anonymous", "use-credentials"],
            preload: ["none", "metadata", "auto"],
            autoplay: ["autoplay"],
            loop: ["loop"],
            controls: ["controls"]
        }
    },
    b: S,
    base: { attrs: { href: null, target: Targets } },
    basefont: S,
    bdi: S,
    bdo: S,
    big: S,
    blockquote: { attrs: { cite: null } },
    body: S,
    br: S,
    button: {
        attrs: {
            form: null, formaction: null, name: null, value: null,
            autofocus: ["autofocus"],
            disabled: ["autofocus"],
            formenctype: Encs,
            formmethod: Methods,
            formnovalidate: ["novalidate"],
            formtarget: Targets,
            type: ["submit", "reset", "button"]
        }
    },
    canvas: { attrs: { width: null, height: null } },
    caption: S,
    center: S,
    cite: S,
    code: S,
    col: { attrs: { span: null } },
    colgroup: { attrs: { span: null } },
    command: {
        attrs: {
            type: ["command", "checkbox", "radio"],
            label: null, icon: null, radiogroup: null, command: null, title: null,
            disabled: ["disabled"],
            checked: ["checked"]
        }
    },
    data: { attrs: { value: null } },
    datagrid: { attrs: { disabled: ["disabled"], multiple: ["multiple"] } },
    datalist: { attrs: { data: null } },
    dd: S,
    del: { attrs: { cite: null, datetime: null } },
    details: { attrs: { open: ["open"] } },
    dfn: S,
    dir: S,
    div: S,
    dl: S,
    dt: S,
    em: S,
    embed: { attrs: { src: null, type: null, width: null, height: null } },
    eventsource: { attrs: { src: null } },
    fieldset: { attrs: { disabled: ["disabled"], form: null, name: null } },
    figcaption: S,
    figure: S,
    font: S,
    footer: S,
    form: {
        attrs: {
            action: null, name: null,
            "accept-charset": Charsets,
            autocomplete: ["on", "off"],
            enctype: Encs,
            method: Methods,
            novalidate: ["novalidate"],
            target: Targets
        }
    },
    frame: S,
    frameset: S,
    h1: S, h2: S, h3: S, h4: S, h5: S, h6: S,
    head: {
        children: ["title", "base", "link", "style", "meta", "script", "noscript", "command"]
    },
    header: S,
    hgroup: S,
    hr: S,
    html: {
        attrs: { manifest: null },
        children: ["head", "body"]
    },
    i: S,
    iframe: {
        attrs: {
            src: null, srcdoc: null, name: null, width: null, height: null,
            sandbox: ["allow-top-navigation", "allow-same-origin", "allow-forms", "allow-scripts"],
            seamless: ["seamless"]
        }
    },
    img: {
        attrs: {
            alt: null, src: null, ismap: null, usemap: null, width: null, height: null,
            crossorigin: ["anonymous", "use-credentials"]
        }
    },
    input: {
        attrs: {
            alt: null, dirname: null, form: null, formaction: null,
            height: null, list: null, max: null, maxlength: null, min: null,
            name: null, pattern: null, placeholder: null, size: null, src: null,
            step: null, value: null, width: null,
            accept: ["audio/*", "video/*", "image/*"],
            autocomplete: ["on", "off"],
            autofocus: ["autofocus"],
            checked: ["checked"],
            disabled: ["disabled"],
            formenctype: Encs,
            formmethod: Methods,
            formnovalidate: ["novalidate"],
            formtarget: Targets,
            multiple: ["multiple"],
            readonly: ["readonly"],
            required: ["required"],
            type: ["hidden", "text", "search", "tel", "url", "email", "password", "datetime", "date", "month",
                "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio",
                "file", "submit", "image", "reset", "button"]
        }
    },
    ins: { attrs: { cite: null, datetime: null } },
    kbd: S,
    keygen: {
        attrs: {
            challenge: null, form: null, name: null,
            autofocus: ["autofocus"],
            disabled: ["disabled"],
            keytype: ["RSA"]
        }
    },
    label: { attrs: { for: null, form: null } },
    legend: S,
    li: { attrs: { value: null } },
    link: {
        attrs: {
            href: null, type: null,
            hreflang: null,
            media: null,
            sizes: ["all", "16x16", "16x16 32x32", "16x16 32x32 64x64"]
        }
    },
    map: { attrs: { name: null } },
    mark: S,
    menu: { attrs: { label: null, type: ["list", "context", "toolbar"] } },
    meta: {
        attrs: {
            content: null,
            charset: Charsets,
            name: ["viewport", "application-name", "author", "description", "generator", "keywords"],
            "http-equiv": ["content-language", "content-type", "default-style", "refresh"]
        }
    },
    meter: { attrs: { value: null, min: null, low: null, high: null, max: null, optimum: null } },
    nav: S,
    noframes: S,
    noscript: S,
    object: {
        attrs: {
            data: null, type: null, name: null, usemap: null, form: null, width: null, height: null,
            typemustmatch: ["typemustmatch"]
        }
    },
    ol: { attrs: { reversed: ["reversed"], start: null, type: ["1", "a", "A", "i", "I"] },
        children: ["li", "script", "template", "ul", "ol"] },
    optgroup: { attrs: { disabled: ["disabled"], label: null } },
    option: { attrs: { disabled: ["disabled"], label: null, selected: ["selected"], value: null } },
    output: { attrs: { for: null, form: null, name: null } },
    p: S,
    param: { attrs: { name: null, value: null } },
    pre: S,
    progress: { attrs: { value: null, max: null } },
    q: { attrs: { cite: null } },
    rp: S,
    rt: S,
    ruby: S,
    s: S,
    samp: S,
    script: {
        attrs: {
            type: ["text/javascript"],
            src: null,
            async: ["async"],
            defer: ["defer"],
            charset: Charsets
        }
    },
    section: S,
    select: {
        attrs: {
            form: null, name: null, size: null,
            autofocus: ["autofocus"],
            disabled: ["disabled"],
            multiple: ["multiple"]
        }
    },
    small: S,
    source: { attrs: { src: null, type: null, media: null } },
    span: S,
    strike: S,
    strong: S,
    style: {
        attrs: {
            type: ["text/css"],
            media: null,
            scoped: null
        }
    },
    sub: S,
    summary: S,
    sup: S,
    table: S,
    tbody: S,
    td: { attrs: { colspan: null, rowspan: null, headers: null } },
    textarea: {
        attrs: {
            dirname: null, form: null, maxlength: null, name: null, placeholder: null,
            rows: null, cols: null,
            autofocus: ["autofocus"],
            disabled: ["disabled"],
            readonly: ["readonly"],
            required: ["required"],
            wrap: ["soft", "hard"]
        }
    },
    tfoot: S,
    th: { attrs: { colspan: null, rowspan: null, headers: null, scope: ["row", "col", "rowgroup", "colgroup"] } },
    thead: S,
    time: { attrs: { datetime: null } },
    title: S,
    tr: S,
    track: {
        attrs: {
            src: null, label: null, default: null,
            kind: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
            srclang: null
        }
    },
    tt: S,
    u: S,
    ul: { children: ["li", "script", "template", "ul", "ol"] },
    var: S,
    video: {
        attrs: {
            src: null, poster: null, width: null, height: null,
            crossorigin: ["anonymous", "use-credentials"],
            preload: ["auto", "metadata", "none"],
            autoplay: ["autoplay"],
            mediagroup: ["movie"],
            muted: ["muted"],
            controls: ["controls"]
        }
    },
    wbr: S
};
const GlobalAttrs = {
    accesskey: null,
    class: null,
    contenteditable: Bool,
    contextmenu: null,
    dir: ["ltr", "rtl", "auto"],
    draggable: ["true", "false", "auto"],
    dropzone: ["copy", "move", "link", "string:", "file:"],
    hidden: ["hidden"],
    id: null,
    inert: ["inert"],
    itemid: null,
    itemprop: null,
    itemref: null,
    itemscope: ["itemscope"],
    itemtype: null,
    lang: ["ar", "bn", "de", "en-GB", "en-US", "es", "fr", "hi", "id", "ja", "pa", "pt", "ru", "tr", "zh"],
    spellcheck: Bool,
    autocorrect: Bool,
    autocapitalize: Bool,
    style: null,
    tabindex: null,
    title: null,
    translate: ["yes", "no"],
    onclick: null,
    rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"],
    role: /*@__PURE__*/"alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),
    "aria-activedescendant": null,
    "aria-atomic": Bool,
    "aria-autocomplete": ["inline", "list", "both", "none"],
    "aria-busy": Bool,
    "aria-checked": ["true", "false", "mixed", "undefined"],
    "aria-controls": null,
    "aria-describedby": null,
    "aria-disabled": Bool,
    "aria-dropeffect": null,
    "aria-expanded": ["true", "false", "undefined"],
    "aria-flowto": null,
    "aria-grabbed": ["true", "false", "undefined"],
    "aria-haspopup": Bool,
    "aria-hidden": Bool,
    "aria-invalid": ["true", "false", "grammar", "spelling"],
    "aria-label": null,
    "aria-labelledby": null,
    "aria-level": null,
    "aria-live": ["off", "polite", "assertive"],
    "aria-multiline": Bool,
    "aria-multiselectable": Bool,
    "aria-owns": null,
    "aria-posinset": null,
    "aria-pressed": ["true", "false", "mixed", "undefined"],
    "aria-readonly": Bool,
    "aria-relevant": null,
    "aria-required": Bool,
    "aria-selected": ["true", "false", "undefined"],
    "aria-setsize": null,
    "aria-sort": ["ascending", "descending", "none", "other"],
    "aria-valuemax": null,
    "aria-valuemin": null,
    "aria-valuenow": null,
    "aria-valuetext": null
};
const AllTags = /*@__PURE__*/Object.keys(Tags);
const GlobalAttrNames = /*@__PURE__*/Object.keys(GlobalAttrs);
function elementName(doc, tree) {
    let tag = tree.firstChild;
    let name = tag && tag.getChild("TagName");
    return name ? doc.sliceString(name.from, name.to) : "";
}
function findParentElement(tree, skip = false) {
    for (let cur = tree.parent; cur; cur = cur.parent)
        if (cur.name == "Element") {
            if (skip)
                skip = false;
            else
                return cur;
        }
    return null;
}
function allowedChildren(doc, tree) {
    let parent = findParentElement(tree, true);
    let parentInfo = parent ? Tags[elementName(doc, parent)] : null;
    return (parentInfo === null || parentInfo === void 0 ? void 0 : parentInfo.children) || AllTags;
}
function openTags(doc, tree) {
    let open = [];
    for (let parent = tree; parent = findParentElement(parent);) {
        let tagName = elementName(doc, parent);
        if (tagName && parent.lastChild.name == "CloseTag")
            break;
        if (tagName && open.indexOf(tagName) < 0 && (tree.name == "EndTag" || tree.from >= parent.firstChild.to))
            open.push(tagName);
    }
    return open;
}
const identifier = /^[:\-\.\w\u00b7-\uffff]+$/;
function completeTag(state, tree, from, to) {
    let end = /\s*>/.test(state.sliceDoc(to, to + 5)) ? "" : ">";
    return { from, to,
        options: allowedChildren(state.doc, tree).map(tagName => ({ label: tagName, type: "type" })).concat(openTags(state.doc, tree).map((tag, i) => ({ label: "/" + tag, apply: "/" + tag + end, type: "type", boost: 99 - i }))),
        span: /^\/?[:\-\.\w\u00b7-\uffff]*$/ };
}
function completeCloseTag(state, tree, from, to) {
    let end = /\s*>/.test(state.sliceDoc(to, to + 5)) ? "" : ">";
    return { from, to,
        options: openTags(state.doc, tree).map((tag, i) => ({ label: tag, apply: tag + end, type: "type", boost: 99 - i })),
        span: identifier };
}
function completeStartTag(state, tree, pos) {
    let options = [], level = 0;
    for (let tagName of allowedChildren(state.doc, tree))
        options.push({ label: "<" + tagName, type: "type" });
    for (let open of openTags(state.doc, tree))
        options.push({ label: "</" + open + ">", type: "type", boost: 99 - level++ });
    return { from: pos, to: pos, options, span: /^<\/?[:\-\.\w\u00b7-\uffff]*$/ };
}
function completeAttrName(state, tree, from, to) {
    let elt = findParentElement(tree), info = elt ? Tags[elementName(state.doc, elt)] : null;
    let names = (info && info.attrs ? Object.keys(info.attrs).concat(GlobalAttrNames) : GlobalAttrNames);
    return { from, to,
        options: names.map(attrName => ({ label: attrName, type: "property" })),
        span: identifier };
}
function completeAttrValue(state, tree, from, to) {
    var _a;
    let nameNode = (_a = tree.parent) === null || _a === void 0 ? void 0 : _a.getChild("AttributeName");
    let options = [], span = undefined;
    if (nameNode) {
        let attrName = state.sliceDoc(nameNode.from, nameNode.to);
        let attrs = GlobalAttrs[attrName];
        if (!attrs) {
            let elt = findParentElement(tree), info = elt ? Tags[elementName(state.doc, elt)] : null;
            attrs = (info === null || info === void 0 ? void 0 : info.attrs) && info.attrs[attrName];
        }
        if (attrs) {
            let base = state.sliceDoc(from, to).toLowerCase(), quoteStart = '"', quoteEnd = '"';
            if (/^['"]/.test(base)) {
                span = base[0] == '"' ? /^[^"]*$/ : /^[^']*$/;
                quoteStart = "";
                quoteEnd = state.sliceDoc(to, to + 1) == base[0] ? "" : base[0];
                base = base.slice(1);
                from++;
            }
            else {
                span = /^[^\s<>='"]*$/;
            }
            for (let value of attrs)
                options.push({ label: value, apply: quoteStart + value + quoteEnd, type: "constant" });
        }
    }
    return { from, to, options, span };
}
function completeHTML(context) {
    let { state, pos } = context, around = syntaxTree(state).resolve(pos), tree = around.resolve(pos, -1);
    if (tree.name == "TagName") {
        return tree.parent && /CloseTag$/.test(tree.parent.name) ? completeCloseTag(state, tree, tree.from, pos)
            : completeTag(state, tree, tree.from, pos);
    }
    else if (tree.name == "StartTag") {
        return completeTag(state, tree, pos, pos);
    }
    else if (tree.name == "StartCloseTag" || tree.name == "IncompleteCloseTag") {
        return completeCloseTag(state, tree, pos, pos);
    }
    else if (context.explicit && (tree.name == "OpenTag" || tree.name == "SelfClosingTag") || tree.name == "AttributeName") {
        return completeAttrName(state, tree, tree.name == "AttributeName" ? tree.from : pos, pos);
    }
    else if (tree.name == "Is" || tree.name == "AttributeValue" || tree.name == "UnquotedAttributeValue") {
        return completeAttrValue(state, tree, tree.name == "Is" ? pos : tree.from, pos);
    }
    else if (context.explicit && (around.name == "Element" || around.name == "Text" || around.name == "Document")) {
        return completeStartTag(state, tree, pos);
    }
    else {
        return null;
    }
}

/**
A language provider based on the [Lezer HTML
parser](https://github.com/lezer-parser/html), wired up with the
JavaScript and CSS parsers to parse the content of `<script>` and
`<style>` tags.
*/
const htmlLanguage = /*@__PURE__*/LezerLanguage.define({
    parser: /*@__PURE__*/parser.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                Element(context) {
                    let after = /^(\s*)(<\/)?/.exec(context.textAfter);
                    if (context.node.to <= context.pos + after[0].length)
                        return context.continue();
                    return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (after[2] ? 0 : context.unit);
                },
                "OpenTag CloseTag SelfClosingTag"(context) {
                    return context.column(context.node.from) + context.unit;
                },
                Document(context) {
                    if (context.pos + /\s*/.exec(context.textAfter)[0].length < context.node.to)
                        return context.continue();
                    let endElt = null, close;
                    for (let cur = context.node;;) {
                        let last = cur.lastChild;
                        if (!last || last.name != "Element" || last.to != cur.to)
                            break;
                        endElt = cur = last;
                    }
                    if (endElt && !((close = endElt.lastChild) && (close.name == "CloseTag" || close.name == "SelfClosingTag")))
                        return context.lineIndent(context.state.doc.lineAt(endElt.from)) + context.unit;
                    return null;
                }
            }),
            /*@__PURE__*/foldNodeProp.add({
                Element(node) {
                    let first = node.firstChild, last = node.lastChild;
                    if (!first || first.name != "OpenTag")
                        return null;
                    return { from: first.to, to: last.name == "CloseTag" ? last.from : node.to };
                }
            }),
            /*@__PURE__*/styleTags({
                AttributeValue: tags.string,
                "Text RawText": tags.content,
                "StartTag StartCloseTag SelfCloserEndTag EndTag SelfCloseEndTag": tags.angleBracket,
                TagName: tags.tagName,
                "MismatchedCloseTag/TagName": [tags.tagName, tags.invalid],
                AttributeName: tags.propertyName,
                UnquotedAttributeValue: tags.string,
                Is: tags.definitionOperator,
                "EntityReference CharacterReference": tags.character,
                Comment: tags.blockComment,
                ProcessingInst: tags.processingInstruction,
                DoctypeDecl: tags.documentMeta
            })
        ],
        nested: /*@__PURE__*/configureNesting([
            { tag: "script",
                attrs(attrs) {
                    return !attrs.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(attrs.type);
                },
                parser: javascriptLanguage.parser },
            { tag: "style",
                attrs(attrs) {
                    return (!attrs.lang || attrs.lang == "css") && (!attrs.type || /^(text\/)?(x-)?(stylesheet|css)$/i.test(attrs.type));
                },
                parser: cssLanguage.parser }
        ])
    }),
    languageData: {
        commentTokens: { block: { open: "<!--", close: "-->" } },
        indentOnInput: /^\s*<\/$/
    }
});
/**
HTML tag completion. Opens and closes tags and attributes in a
context-aware way.
*/
const htmlCompletion = /*@__PURE__*/htmlLanguage.data.of({ autocomplete: completeHTML });
/**
Language support for HTML, including
[`htmlCompletion`](https://codemirror.net/6/docs/ref/#lang-html.htmlCompletion) and JavaScript and
CSS support extensions.
*/
function html() {
    return new LanguageSupport(htmlLanguage, [htmlCompletion, javascript().support, css().support]);
}

export { html, htmlCompletion, htmlLanguage };
