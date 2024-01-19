import { parser } from  './lezer-rust.js';
import { LezerLanguage, indentNodeProp, continuedIndent, foldNodeProp, foldInside, LanguageSupport } from  './language.js';
import { styleTags, tags } from  './highlight.js';

/// A syntax provider based on the [Lezer Rust
/// parser](https://github.com/lezer-parser/rust), extended with
/// highlighting and indentation information.
const rustLanguage = LezerLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                IfExpression: continuedIndent({ except: /^\s*({|else\b)/ }),
                "String BlockComment": () => -1,
                "Statement MatchArm": continuedIndent()
            }),
            foldNodeProp.add(type => {
                if (/(Block|edTokens|List)$/.test(type.name))
                    return foldInside;
                if (type.name == "BlockComment")
                    return tree => ({ from: tree.from + 2, to: tree.to - 2 });
                return undefined;
            }),
            styleTags({
                "const macro_rules mod struct union enum type fn impl trait let use crate static": tags.definitionKeyword,
                "pub unsafe async mut extern default move": tags.modifier,
                "for if else loop while match continue break return await": tags.controlKeyword,
                "as in ref": tags.operatorKeyword,
                "where _ crate super dyn": tags.keyword,
                "self": tags.self,
                String: tags.string,
                RawString: tags.special(tags.string),
                Boolean: tags.bool,
                Identifier: tags.variableName,
                "CallExpression/Identifier": tags.function(tags.variableName),
                BoundIdentifier: tags.definition(tags.variableName),
                LoopLabel: tags.labelName,
                FieldIdentifier: tags.propertyName,
                "CallExpression/FieldExpression/FieldIdentifier": tags.function(tags.propertyName),
                Lifetime: tags.special(tags.variableName),
                ScopeIdentifier: tags.namespace,
                TypeIdentifier: tags.typeName,
                "MacroInvocation/Identifier MacroInvocation/ScopedIdentifier/Identifier": tags.macroName,
                "MacroInvocation/TypeIdentifier MacroInvocation/ScopedIdentifier/TypeIdentifier": tags.macroName,
                "\"!\"": tags.macroName,
                UpdateOp: tags.updateOperator,
                LineComment: tags.lineComment,
                BlockComment: tags.blockComment,
                Integer: tags.integer,
                Float: tags.float,
                ArithOp: tags.arithmeticOperator,
                LogicOp: tags.logicOperator,
                BitOp: tags.bitwiseOperator,
                CompareOp: tags.compareOperator,
                "=": tags.definitionOperator,
                ".. ... => ->": tags.punctuation,
                "( )": tags.paren,
                "[ ]": tags.squareBracket,
                "{ }": tags.brace,
                ".": tags.derefOperator,
                "&": tags.operator,
                ", ; ::": tags.separator,
            })
        ]
    }),
    languageData: {
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
        indentOnInput: /^\s*(?:\{|\})$/
    }
});
/// Rust language support
function rust() {
    return new LanguageSupport(rustLanguage);
}

export { rust, rustLanguage };
