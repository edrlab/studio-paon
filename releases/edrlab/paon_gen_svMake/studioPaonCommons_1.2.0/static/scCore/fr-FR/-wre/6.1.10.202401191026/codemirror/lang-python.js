import { parser } from  './lezer-python.js';
import { LezerLanguage, indentNodeProp, continuedIndent, foldNodeProp, foldInside, LanguageSupport } from  './language.js';
import { styleTags, tags } from  './highlight.js';

/// A language provider based on the [Lezer Python
/// parser](https://github.com/lezer-parser/python), extended with
/// highlighting and indentation information.
const pythonLanguage = LezerLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Body: continuedIndent()
            }),
            foldNodeProp.add({
                "Body ArrayExpression DictionaryExpression": foldInside
            }),
            styleTags({
                "async '*' '**' FormatConversion": tags.modifier,
                "for while if elif else try except finally return raise break continue with pass assert await yield": tags.controlKeyword,
                "in not and or is del": tags.operatorKeyword,
                "import from def class global nonlocal lambda": tags.definitionKeyword,
                "with as print": tags.keyword,
                self: tags.self,
                Boolean: tags.bool,
                None: tags.null,
                VariableName: tags.variableName,
                "CallExpression/VariableName": tags.function(tags.variableName),
                "FunctionDefinition/VariableName": tags.function(tags.definition(tags.variableName)),
                "ClassDefinition/VariableName": tags.definition(tags.className),
                PropertyName: tags.propertyName,
                "CallExpression/MemberExpression/ProperyName": tags.function(tags.propertyName),
                Comment: tags.lineComment,
                Number: tags.number,
                String: tags.string,
                FormatString: tags.special(tags.string),
                UpdateOp: tags.updateOperator,
                ArithOp: tags.arithmeticOperator,
                BitOp: tags.bitwiseOperator,
                CompareOp: tags.compareOperator,
                AssignOp: tags.definitionOperator,
                Ellipsis: tags.punctuation,
                At: tags.meta,
                "( )": tags.paren,
                "[ ]": tags.squareBracket,
                "{ }": tags.brace,
                ".": tags.derefOperator,
                ", ;": tags.separator
            })
        ],
    }),
    languageData: {
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "'''", '"""'] },
        commentTokens: { line: "#" },
        indentOnInput: /^\s*[\}\]\)]$/
    }
});
/// Python language support.
function python() {
    return new LanguageSupport(pythonLanguage);
}

export { python, pythonLanguage };
