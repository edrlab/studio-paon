import { parser } from  './lezer-java.js';
import { LezerLanguage, indentNodeProp, continuedIndent, flatIndent, foldNodeProp, foldInside, LanguageSupport } from  './language.js';
import { styleTags, tags } from  './highlight.js';

/// A language provider based on the [Lezer Java
/// parser](https://github.com/lezer-parser/java), extended with
/// highlighting and indentation information.
const javaLanguage = LezerLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                IfStatement: continuedIndent({ except: /^\s*({|else\b)/ }),
                TryStatement: continuedIndent({ except: /^\s*({|catch|finally)\b/ }),
                LabeledStatement: flatIndent,
                SwitchBlock: context => {
                    let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
                    return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
                },
                BlockComment: () => -1,
                Statement: continuedIndent({ except: /^{/ })
            }),
            foldNodeProp.add({
                ["Block SwitchBlock ClassBody ElementValueArrayInitializer ModuleBody EnumBody " +
                    "ConstructorBody InterfaceBody ArrayInitializer"]: foldInside,
                BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; }
            }),
            styleTags({
                null: tags.null,
                instanceof: tags.operatorKeyword,
                this: tags.self,
                "new super assert open to with void": tags.keyword,
                "class interface extends implements module package import enum": tags.definitionKeyword,
                "switch while for if else case default do break continue return try catch finally throw": tags.controlKeyword,
                ["requires exports opens uses provides public private protected static transitive abstract final " +
                    "strictfp synchronized native transient volatile throws"]: tags.modifier,
                IntegerLiteral: tags.integer,
                FloatLiteral: tags.float,
                StringLiteral: tags.string,
                CharacterLiteral: tags.character,
                LineComment: tags.lineComment,
                BlockComment: tags.blockComment,
                BooleanLiteral: tags.bool,
                PrimitiveType: tags.standard(tags.typeName),
                TypeName: tags.typeName,
                Identifier: tags.variableName,
                "MethodName/Identifier": tags.function(tags.variableName),
                Definition: tags.definition(tags.variableName),
                ArithOp: tags.arithmeticOperator,
                LogicOp: tags.logicOperator,
                BitOp: tags.bitwiseOperator,
                CompareOp: tags.compareOperator,
                AssignOp: tags.definitionOperator,
                UpdateOp: tags.updateOperator,
                Asterisk: tags.punctuation,
                Label: tags.labelName,
                "( )": tags.paren,
                "[ ]": tags.squareBracket,
                "{ }": tags.brace,
                ".": tags.derefOperator,
                ", ;": tags.separator
            })
        ]
    }),
    languageData: {
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
        indentOnInput: /^\s*(?:case |default:|\{|\})$/
    }
});
/// Java language support.
function java() {
    return new LanguageSupport(javaLanguage);
}

export { java, javaLanguage };
