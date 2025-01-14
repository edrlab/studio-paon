import { syntaxTree, indentNodeProp, continuedIndent, foldNodeProp, LezerLanguage, LanguageSupport } from  './language.js';
import { styleTags, tags } from  './highlight.js';
import { ExternalTokenizer, Parser } from  './lezer.js';
import { ifNotIn, completeFromList } from  './autocomplete.js';

// This file was generated by lezer-generator. You probably shouldn't edit it.
const whitespace = 34,
  LineComment = 1,
  BlockComment = 2,
  String = 3,
  Number = 4,
  Bool = 5,
  Null = 6,
  ParenL = 7,
  ParenR = 8,
  BraceL = 9,
  BraceR = 10,
  BracketL = 11,
  BracketR = 12,
  Semi = 13,
  Dot = 14,
  Operator = 15,
  Punctuation = 16,
  SpecialVar = 17,
  Identifier = 18,
  QuotedIdentifier = 19,
  Keyword = 20,
  Type = 21,
  Builtin = 22;

function isAlpha(ch) {
    return ch >= 65 /* A */ && ch <= 90 /* Z */ || ch >= 97 /* a */ && ch <= 122 /* z */ || ch >= 48 /* _0 */ && ch <= 57 /* _9 */;
}
function isHexDigit(ch) {
    return ch >= 48 /* _0 */ && ch <= 57 /* _9 */ || ch >= 97 /* a */ && ch <= 102 /* f */ || ch >= 65 /* A */ && ch <= 70 /* F */;
}
function readLiteral(input, pos, endQuote, backslashEscapes) {
    for (let escaped = false;;) {
        let next = input.get(pos++);
        if (next < 0)
            return pos - 1;
        if (next == endQuote && !escaped)
            return pos;
        escaped = backslashEscapes && !escaped && next == 92 /* Backslash */;
    }
}
function readWord(input, pos) {
    for (;; pos++) {
        let next = input.get(pos);
        if (next != 95 /* Underscore */ && !isAlpha(next))
            break;
    }
    return pos;
}
function readWordOrQuoted(input, pos) {
    let next = input.get(pos);
    if (next == 39 /* SingleQuote */ || next == 34 /* DoubleQuote */ || next == 96 /* Backtick */)
        return readLiteral(input, pos + 1, next, false);
    return readWord(input, pos);
}
function readNumber(input, pos, sawDot) {
    let next;
    for (;; pos++) {
        next = input.get(pos);
        if (next == 46 /* Dot */) {
            if (sawDot)
                break;
            sawDot = true;
        }
        else if (next < 48 /* _0 */ || next > 57 /* _9 */) {
            break;
        }
    }
    if (next == 69 /* E */ || next == 101 /* e */) {
        next = input.get(++pos);
        if (next == 43 /* Plus */ || next == 45 /* Dash */)
            pos++;
        for (;; pos++) {
            next = input.get(pos);
            if (next < 48 /* _0 */ || next > 57 /* _9 */)
                break;
        }
    }
    return pos;
}
function eol(input, pos) {
    for (;; pos++) {
        let next = input.get(pos);
        if (next < 0 || next == 10 /* Newline */)
            return pos;
    }
}
function inString(ch, str) {
    for (let i = 0; i < str.length; i++)
        if (str.charCodeAt(i) == ch)
            return true;
    return false;
}
const Space = " \t\r\n";
function keywords(keywords, types, builtin) {
    let result = Object.create(null);
    result["true"] = result["false"] = Bool;
    result["null"] = result["unknown"] = Null;
    for (let kw of keywords.split(" "))
        if (kw)
            result[kw] = Keyword;
    for (let tp of types.split(" "))
        if (tp)
            result[tp] = Type;
    for (let kw of (builtin || "").split(" "))
        if (kw)
            result[kw] = Builtin;
    return result;
}
const SQLTypes = "array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying ";
const SQLKeywords = "absolute action add after all allocate alter and any are as asc assertion at authorization before begin between blob both breadth by call cascade cascaded case cast catalog check close collate collation column commit condition connect connection constraint constraints constructor continue corresponding count create cross cube current current_date current_default_transform_group current_transform_group_for_type current_path current_role current_time current_timestamp current_user cursor cycle data day deallocate dec declare default deferrable deferred delete depth deref desc describe descriptor deterministic diagnostics disconnect distinct do domain drop dynamic each else elseif end end-exec equals escape except exception exec execute exists exit external fetch first for foreign found from free full function general get global go goto grant group grouping handle having hold hour identity if immediate in indicator initially inner inout input insert intersect into is isolation join key language last lateral leading leave left level like limit local localtime localtimestamp locator loop map match method minute modifies module month names natural nesting new next no none not of old on only open option or order ordinality out outer output overlaps pad parameter partial path prepare preserve primary prior privileges procedure public read reads recursive redo ref references referencing relative release repeat resignal restrict result return returns revoke right role rollback rollup routine row rows savepoint schema scroll search second section select session session_user set sets signal similar size some space specific specifictype sql sqlexception sqlstate sqlwarning start state static system_user table temporary then timezone_hour timezone_minute to trailing transaction translation treat trigger under undo union unique unnest until update usage user using value values view when whenever where while with without work write year zone ";
const defaults = {
    backslashEscapes: false,
    hashComments: false,
    spaceAfterDashes: false,
    slashComments: false,
    doubleQuotedStrings: false,
    charSetCasts: false,
    operatorChars: "*+\-%<>!=&|~^/",
    specialVar: "?",
    identifierQuotes: '"',
    words: keywords(SQLKeywords, SQLTypes)
};
function dialect(spec, kws, types, builtin) {
    let dialect = {};
    for (let prop in defaults)
        dialect[prop] = (spec.hasOwnProperty(prop) ? spec : defaults)[prop];
    if (kws)
        dialect.words = keywords(kws, types || "", builtin);
    return dialect;
}
function tokensFor(d) {
    return new ExternalTokenizer((input, token) => {
        var _a;
        let pos = token.start, next = input.get(pos++), next2 = input.get(pos);
        if (inString(next, Space)) {
            while (inString(input.get(pos), Space))
                pos++;
            token.accept(whitespace, pos);
        }
        else if (next == 39 /* SingleQuote */ || next == 34 /* DoubleQuote */ && d.doubleQuotedStrings) {
            token.accept(String, readLiteral(input, pos, next, d.backslashEscapes));
        }
        else if (next == 35 /* Hash */ && d.hashComments ||
            next == 47 /* Slash */ && next2 == 47 /* Slash */ && d.slashComments) {
            token.accept(LineComment, eol(input, pos));
        }
        else if (next == 45 /* Dash */ && next2 == 45 /* Dash */ &&
            (!d.spaceAfterDashes || input.get(pos + 1) == 32 /* Space */)) {
            token.accept(LineComment, eol(input, pos + 1));
        }
        else if (next == 47 /* Slash */ && next2 == 42 /* Star */) {
            pos++;
            for (let prev = -1, depth = 1;;) {
                let next = input.get(pos++);
                if (next < 0) {
                    pos--;
                    break;
                }
                else if (prev == 42 /* Star */ && next == 47 /* Slash */) {
                    depth--;
                    if (!depth)
                        break;
                    next = -1;
                }
                else if (prev == 47 /* Slash */ && next == 42 /* Star */) {
                    depth++;
                    next = -1;
                }
                prev = next;
            }
            token.accept(BlockComment, pos);
        }
        else if ((next == 101 /* e */ || next == 69 /* E */) && next2 == 39 /* SingleQuote */) {
            token.accept(String, readLiteral(input, pos + 1, 39 /* SingleQuote */, true));
        }
        else if ((next == 110 /* n */ || next == 78 /* N */) && next2 == 39 /* SingleQuote */ &&
            d.charSetCasts) {
            token.accept(String, readLiteral(input, pos + 1, 39 /* SingleQuote */, d.backslashEscapes));
        }
        else if (next == 95 /* Underscore */ && d.charSetCasts) {
            for (;;) {
                let next = input.get(pos++);
                if (next == 39 /* SingleQuote */ && pos > token.start + 2) {
                    token.accept(String, readLiteral(input, pos, 39 /* SingleQuote */, d.backslashEscapes));
                    break;
                }
                if (!isAlpha(next))
                    break;
            }
        }
        else if (next == 40 /* ParenL */) {
            token.accept(ParenL, pos);
        }
        else if (next == 41 /* ParenR */) {
            token.accept(ParenR, pos);
        }
        else if (next == 123 /* BraceL */) {
            token.accept(BraceL, pos);
        }
        else if (next == 125 /* BraceR */) {
            token.accept(BraceR, pos);
        }
        else if (next == 91 /* BracketL */) {
            token.accept(BracketL, pos);
        }
        else if (next == 93 /* BracketR */) {
            token.accept(BracketR, pos);
        }
        else if (next == 59 /* Semi */) {
            token.accept(Semi, pos);
        }
        else if (next == 48 /* _0 */ && (next2 == 98 /* b */ || next2 == 66 /* B */) ||
            (next == 98 /* b */ || next == 66 /* B */) && next2 == 39 /* SingleQuote */) {
            let quoted = next2 == 39 /* SingleQuote */;
            pos++;
            while ((next = input.get(pos)) == 48 /* _0 */ || next == 49 /* _1 */)
                pos++;
            if (quoted && next == 39 /* SingleQuote */)
                pos++;
            token.accept(Number, pos);
        }
        else if (next == 48 /* _0 */ && (next2 == 120 /* x */ || next2 == 88 /* X */) ||
            (next == 120 /* x */ || next == 88 /* X */) && next2 == 39 /* SingleQuote */) {
            let quoted = next2 == 39 /* SingleQuote */;
            pos++;
            while (isHexDigit(next = input.get(pos)))
                pos++;
            if (quoted && next == 39 /* SingleQuote */)
                pos++;
            token.accept(Number, pos);
        }
        else if (next == 46 /* Dot */ && next2 >= 48 /* _0 */ && next2 <= 57 /* _9 */) {
            token.accept(Number, readNumber(input, pos + 1, true));
        }
        else if (next == 46 /* Dot */) {
            token.accept(Dot, pos);
        }
        else if (next >= 48 /* _0 */ && next <= 57 /* _9 */) {
            token.accept(Number, readNumber(input, pos, false));
        }
        else if (inString(next, d.operatorChars)) {
            while (inString(input.get(pos), d.operatorChars))
                pos++;
            token.accept(Operator, pos);
        }
        else if (inString(next, d.specialVar)) {
            token.accept(SpecialVar, readWordOrQuoted(input, next2 == next ? pos + 1 : pos));
        }
        else if (inString(next, d.identifierQuotes)) {
            token.accept(QuotedIdentifier, readLiteral(input, pos, next, false));
        }
        else if (next == 58 /* Colon */ || next == 44 /* Comma */) {
            token.accept(Punctuation, pos);
        }
        else if (isAlpha(next)) {
            pos = readWord(input, pos);
            token.accept((_a = d.words[input.read(token.start, pos).toLowerCase()]) !== null && _a !== void 0 ? _a : Identifier, pos);
        }
    });
}
const tokens = tokensFor(defaults);

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = Parser.deserialize({
  version: 13,
  states: "%dQ]QQOOO#kQRO'#DQO#rQQO'#CuO%RQQO'#CvO%YQQO'#CwO%aQQO'#CxOOQQ'#DQ'#DQOOQQ'#C{'#C{O&lQRO'#CyOOQQ'#Ct'#CtOOQQ'#Cz'#CzQ]QQOOQOQQOOO&vQQO,59aO'RQQO,59aO'WQQO'#DQOOQQ,59b,59bO'eQQO,59bOOQQ,59c,59cO'lQQO,59cOOQQ,59d,59dO'sQQO,59dOOQQ-E6y-E6yOOQQ,59`,59`OOQQ-E6x-E6xOOQQ'#C|'#C|OOQQ1G.{1G.{O&vQQO1G.{OOQQ1G.|1G.|OOQQ1G.}1G.}OOQQ1G/O1G/OP'zQQO'#C{POQQ-E6z-E6zOOQQ7+$g7+$g",
  stateData: "(R~OrOSPOSQOS~ORUOSUOTUOUUOVROXSOZTO]XO^QO_UO`UOaPObPOcPOdUOeUOfUO~O^]ORtXStXTtXUtXVtXXtXZtX]tX_tX`tXatXbtXctXdtXetXftX~OqtX~P!dOa^Ob^Oc^O~ORUOSUOTUOUUOVROXSOZTO^QO_UO`UOa_Ob_Oc_OdUOeUOfUO~OW`O~P#}OYbO~P#}O[dO~P#}ORUOSUOTUOUUOVROXSOZTO^QO_UO`UOaPObPOcPOdUOeUOfUO~O]gOqmX~P%hOaiObiOciO~O^kO~OWtXYtX[tX~P!dOWlO~P#}OYmO~P#}O[nO~P#}O]gO~P#}O",
  goto: "#YuPPPPPPPPPPPPPPPPPPPPPPPPvzzzz!W![!b!vPPP!|TYOZeUORSTWZaceoT[OZQZORhZSWOZQaRQcSQeTZfWaceoQj]RqkeVORSTWZaceo",
  nodeNames: "⚠ LineComment BlockComment String Number Bool Null ( ) [ ] { } ; . Operator Punctuation SpecialVar Identifier QuotedIdentifier Keyword Type Builtin Script Statement CompositeIdentifier Parens Braces Brackets Statement",
  maxTerm: 36,
  skippedNodes: [0,1,2],
  repeatNodeCount: 3,
  tokenData: "RORO",
  tokenizers: [0, tokens],
  topRules: {"Script":[0,23]},
  tokenPrec: 0
});

function tokenBefore(tree) {
    let cursor = tree.cursor.moveTo(tree.from, -1);
    while (/Comment/.test(cursor.name))
        cursor.moveTo(cursor.from, -1);
    return cursor.node;
}
function stripQuotes(name) {
    let quoted = /^[`'"](.*)[`'"]$/.exec(name);
    return quoted ? quoted[1] : name;
}
function sourceContext(state, startPos) {
    let pos = syntaxTree(state).resolve(startPos, -1);
    let empty = false;
    if (pos.name == "Identifier" || pos.name == "QuotedIdentifier") {
        empty = false;
        let parent = null;
        let dot = tokenBefore(pos);
        if (dot && dot.name == ".") {
            let before = tokenBefore(dot);
            if (before && before.name == "Identifier" || before.name == "QuotedIdentifier")
                parent = stripQuotes(state.sliceDoc(before.from, before.to).toLowerCase());
        }
        return { parent,
            from: pos.from,
            quoted: pos.name == "QuotedIdentifier" ? state.sliceDoc(pos.from, pos.from + 1) : null };
    }
    else if (pos.name == ".") {
        let before = tokenBefore(pos);
        if (before && before.name == "Identifier" || before.name == "QuotedIdentifier")
            return { parent: stripQuotes(state.sliceDoc(before.from, before.to).toLowerCase()),
                from: startPos,
                quoted: null };
    }
    else {
        empty = true;
    }
    return { parent: null, from: startPos, quoted: null, empty };
}
function maybeQuoteCompletions(quote, completions) {
    if (!quote)
        return completions;
    return completions.map(c => (Object.assign(Object.assign({}, c), { label: quote + c.label + quote, apply: undefined })));
}
const Span = /^\w*$/, QuotedSpan = /^[`'"]?\w*[`'"]?$/;
function completeFromSchema(schema, tables, defaultTable) {
    let byTable = Object.create(null);
    for (let table in schema)
        byTable[table] = schema[table].map(val => {
            return typeof val == "string" ? { label: val, type: "property" } : val;
        });
    let topOptions = (tables || Object.keys(byTable).map(name => ({ label: name, type: "type" })))
        .concat(defaultTable && byTable[defaultTable] || []);
    return (context) => {
        let { parent, from, quoted, empty } = sourceContext(context.state, context.pos);
        if (empty && !context.explicit)
            return null;
        let options = topOptions;
        if (parent) {
            let columns = byTable[parent];
            if (!columns)
                return null;
            options = columns;
        }
        let quoteAfter = quoted && context.state.sliceDoc(context.pos, context.pos + 1) == quoted;
        return {
            from,
            to: quoteAfter ? context.pos + 1 : undefined,
            options: maybeQuoteCompletions(quoted, options),
            span: quoted ? QuotedSpan : Span
        };
    };
}
function completeKeywords(keywords, upperCase) {
    let completions = Object.keys(keywords).map(keyword => ({
        label: upperCase ? keyword.toUpperCase() : keyword,
        type: keywords[keyword] == Type ? "type" : keywords[keyword] == Keyword ? "keyword" : "variable",
        boost: -1
    }));
    return ifNotIn(["QuotedIdentifier", "SpecialVar", "String", "LineComment", "BlockComment", "."], completeFromList(completions));
}

let parser$1 = parser.configure({
    props: [
        indentNodeProp.add({
            Statement: continuedIndent()
        }),
        foldNodeProp.add({
            Statement(tree) { return { from: tree.firstChild.to, to: tree.to }; },
            BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; }
        }),
        styleTags({
            Keyword: tags.keyword,
            Type: tags.typeName,
            Builtin: tags.standard(tags.name),
            Bool: tags.bool,
            Null: tags.null,
            Number: tags.number,
            String: tags.string,
            Identifier: tags.name,
            QuotedIdentifier: tags.special(tags.string),
            SpecialVar: tags.special(tags.name),
            LineComment: tags.lineComment,
            BlockComment: tags.blockComment,
            Operator: tags.operator,
            "Semi Punctuation": tags.punctuation,
            "( )": tags.paren,
            "{ }": tags.brace,
            "[ ]": tags.squareBracket
        })
    ]
});
/// Represents an SQL dialect.
class SQLDialect {
    /// @internal
    constructor(
    /// @internal
    dialect, 
    /// The language for this dialect.
    language) {
        this.dialect = dialect;
        this.language = language;
    }
    /// Returns the language for this dialect as an extension.
    get extension() { return this.language.extension; }
    /// Define a new dialect.
    static define(spec) {
        let d = dialect(spec, spec.keywords, spec.types, spec.builtin);
        let language = LezerLanguage.define({
            parser: parser$1.configure({
                tokenizers: [{ from: tokens, to: tokensFor(d) }]
            }),
            languageData: {
                commentTokens: { line: "--", block: { open: "/*", close: "*/" } },
                closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
            }
        });
        return new SQLDialect(d, language);
    }
}
/// Returns an extension that enables keyword completion for the given
/// SQL dialect.
function keywordCompletion(dialect, upperCase = false) {
    return dialect.language.data.of({
        autocomplete: completeKeywords(dialect.dialect.words, upperCase)
    });
}
/// Returns an extension that enables schema-based completion for the
/// given configuration.
function schemaCompletion(config) {
    return config.schema ? (config.dialect || StandardSQL).language.data.of({
        autocomplete: completeFromSchema(config.schema, config.tables, config.defaultTable)
    }) : [];
}
/// SQL language support for the given SQL dialect, with keyword
/// completion, and, if provided, schema-based completion as extra
/// extensions.
function sql(config = {}) {
    let lang = config.dialect || StandardSQL;
    return new LanguageSupport(lang.language, [schemaCompletion(config), keywordCompletion(lang, !!config.upperCaseKeywords)]);
}
/// The standard SQL dialect.
const StandardSQL = SQLDialect.define({});
/// Dialect for [PostgreSQL](https://www.postgresql.org).
const PostgreSQL = SQLDialect.define({
    charSetCasts: true,
    operatorChars: "+-*/<>=~!@#%^&|`?",
    specialVar: "",
    keywords: SQLKeywords + "a abort abs absent access according ada admin aggregate alias also always analyse analyze array_agg array_max_cardinality asensitive assert assignment asymmetric atomic attach attribute attributes avg backward base64 begin_frame begin_partition bernoulli bit_length blocked bom c cache called cardinality catalog_name ceil ceiling chain char_length character_length character_set_catalog character_set_name character_set_schema characteristics characters checkpoint class class_origin cluster coalesce cobol collation_catalog collation_name collation_schema collect column_name columns command_function command_function_code comment comments committed concurrently condition_number configuration conflict connection_name constant constraint_catalog constraint_name constraint_schema contains content control conversion convert copy corr cost covar_pop covar_samp csv cume_dist current_catalog current_row current_schema cursor_name database datalink datatype datetime_interval_code datetime_interval_precision db debug defaults defined definer degree delimiter delimiters dense_rank depends derived detach detail dictionary disable discard dispatch dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue document dump dynamic_function dynamic_function_code element elsif empty enable encoding encrypted end_frame end_partition endexec enforced enum errcode error event every exclude excluding exclusive exp explain expression extension extract family file filter final first_value flag floor following force foreach fortran forward frame_row freeze fs functions fusion g generated granted greatest groups handler header hex hierarchy hint id ignore ilike immediately immutable implementation implicit import include including increment indent index indexes info inherit inherits inline insensitive instance instantiable instead integrity intersection invoker isnull k key_member key_type label lag last_value lead leakproof least length library like_regex link listen ln load location lock locked log logged lower m mapping matched materialized max max_cardinality maxvalue member merge message message_length message_octet_length message_text min minvalue mod mode more move multiset mumps name namespace nfc nfd nfkc nfkd nil normalize normalized nothing notice notify notnull nowait nth_value ntile nullable nullif nulls number occurrences_regex octet_length octets off offset oids operator options ordering others over overlay overriding owned owner p parallel parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partition pascal passing passthrough password percent percent_rank percentile_cont percentile_disc perform period permission pg_context pg_datatype_name pg_exception_context pg_exception_detail pg_exception_hint placing plans pli policy portion position position_regex power precedes preceding prepared print_strict_params procedural procedures program publication query quote raise range rank reassign recheck recovery refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex rename repeatable replace replica requiring reset respect restart restore result_oid returned_cardinality returned_length returned_octet_length returned_sqlstate returning reverse routine_catalog routine_name routine_schema routines row_count row_number rowtype rule scale schema_name schemas scope scope_catalog scope_name scope_schema security selective self sensitive sequence sequences serializable server server_name setof share show simple skip slice snapshot source specific_name sqlcode sqlerror sqrt stable stacked standalone statement statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset subscription substring substring_regex succeeds sum symmetric sysid system system_time t table_name tables tablesample tablespace temp template ties token top_level_count transaction_active transactions_committed transactions_rolled_back transform transforms translate translate_regex trigger_catalog trigger_name trigger_schema trim trim_array truncate trusted type types uescape unbounded uncommitted unencrypted unlink unlisten unlogged unnamed untyped upper uri use_column use_variable user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema vacuum valid validate validator value_of var_pop var_samp varbinary variable_conflict variadic verbose version versioning views volatile warning whitespace width_bucket window within wrapper xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate yes",
    types: SQLTypes + "bigint int8 bigserial serial8 varbit bool box bytea cidr circle precision float8 inet int4 json jsonb line lseg macaddr macaddr8 money numeric path pg_lsn point polygon float4 int2 smallserial serial2 serial serial4 text without zone with timetz timestamptz tsquery tsvector txid_snapshot uuid xml"
});
const MySQLKeywords = "accessible algorithm analyze asensitive authors auto_increment autocommit avg avg_row_length binlog btree cache catalog_name chain change changed checkpoint checksum class_origin client_statistics coalesce code collations columns comment committed completion concurrent consistent contains contributors convert database databases day_hour day_microsecond day_minute day_second delay_key_write delayed delimiter des_key_file dev_pop dev_samp deviance directory disable discard distinctrow div dual dumpfile enable enclosed ends engine engines enum errors escaped even event events every explain extended fast field fields flush force found_rows fulltext grants handler hash high_priority hosts hour_microsecond hour_minute hour_second ignore ignore_server_ids import index index_statistics infile innodb insensitive insert_method install invoker iterate keys kill linear lines list load lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modify mutex mysql_errno no_write_to_binlog offline offset one online optimize optionally outfile pack_keys parser partition partitions password phase plugin plugins prev processlist profile profiles purge query quick range read_write rebuild recover regexp relaylog remove rename reorganize repair repeatable replace require resume rlike row_format rtree schedule schema_name schemas second_microsecond security sensitive separator serializable server share show slave slow snapshot soname spatial sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result ssl starting starts std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace terminated triggers truncate uncommitted uninstall unlock upgrade use use_frm user_resources user_statistics utc_date utc_time utc_timestamp variables views warnings xa xor year_month zerofill";
const MySQLTypes = SQLTypes + "bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int1 int2 int3 int4 int8 float4 float8 varbinary varcharacter precision datetime year unsigned signed";
const MySQLBuiltin = "charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee";
/// [MySQL](https://dev.mysql.com/) dialect.
const MySQL = SQLDialect.define({
    operatorChars: "*+-%<>!=&|^",
    charSetCasts: true,
    doubleQuotedStrings: true,
    hashComments: true,
    spaceAfterDashes: true,
    specialVar: "@?",
    identifierQuotes: "`",
    keywords: SQLKeywords + "group_concat " + MySQLKeywords,
    types: MySQLTypes,
    builtin: MySQLBuiltin
});
/// Variant of [`MySQL`](#lang-sql.MySQL) for
/// [MariaDB](https://mariadb.org/).
const MariaSQL = SQLDialect.define({
    operatorChars: "*+-%<>!=&|^",
    charSetCasts: true,
    doubleQuotedStrings: true,
    hashComments: true,
    spaceAfterDashes: true,
    specialVar: "@?",
    identifierQuotes: "`",
    keywords: SQLKeywords + "always generated groupby_concat hard persistent shutdown soft virtual " + MySQLKeywords,
    types: MySQLTypes,
    builtin: MySQLBuiltin
});
/// SQL dialect for Microsoft [SQL
/// Server](https://www.microsoft.com/en-us/sql-server).
const MSSQL = SQLDialect.define({
    keywords: SQLKeywords + "trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare exec go if use index holdlock nolock nowait paglock pivot readcommitted readcommittedlock readpast readuncommitted repeatableread rowlock serializable snapshot tablock tablockx unpivot updlock with",
    types: SQLTypes + "bigint smallint smallmoney tinyint money real text nvarchar ntext varbinary image cursor hierarchyid uniqueidentifier sql_variant xml table",
    builtin: "binary_checksum checksum connectionproperty context_info current_request_id error_line error_message error_number error_procedure error_severity error_state formatmessage get_filestream_transaction_context getansinull host_id host_name isnull isnumeric min_active_rowversion newid newsequentialid rowcount_big xact_state object_id",
    operatorChars: "*+-%<>!=^&|/",
    specialVar: "@"
});
/// [SQLite](https://sqlite.org/) dialect.
const SQLite = SQLDialect.define({
    keywords: SQLKeywords + "abort analyze attach autoincrement conflict database detach exclusive fail glob ignore index indexed instead isnull notnull offset plan pragma query raise regexp reindex rename replace temp vacuum virtual",
    types: SQLTypes + "bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int2 int8 year unsigned signed real",
    builtin: "auth backup bail binary changes check clone databases dbinfo dump echo eqp exit explain fullschema headers help import imposter indexes iotrace limit lint load log mode nullvalue once open output print prompt quit read restore save scanstats schema separator session shell show stats system tables testcase timeout timer trace vfsinfo vfslist vfsname width",
    operatorChars: "*+-%<>!=&|/~",
    identifierQuotes: "`\"",
    specialVar: "@:?$"
});
/// Dialect for [Cassandra](https://cassandra.apache.org/)'s SQL-ish query language.
const Cassandra = SQLDialect.define({
    keywords: "add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime infinity NaN",
    types: SQLTypes + "ascii bigint blob counter frozen inet list map static text timeuuid tuple uuid varint",
    slashComments: true
});
/// [PL/SQL](https://en.wikipedia.org/wiki/PL/SQL) dialect.
const PLSQL = SQLDialect.define({
    keywords: SQLKeywords + "abort accept access add all alter and any array arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body boolean by case cast char char_base check close cluster clusters colauth column comment commit compress connect connected constant constraint crash create current currval cursor data_base database date dba deallocate debugoff debugon decimal declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry escape exception exception_init exchange exclusive exists exit external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging long loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base object of off offline on online only open option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw read rebuild record ref references refresh release rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate session set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work",
    builtin: "appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define describe echo editfile embedded escape exec execute feedback flagger flush heading headsep instance linesize lno loboffset logsource long longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar release repfooter repheader serveroutput shiftinout show showmode size spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout time timing trimout trimspool ttitle underline verify version wrap",
    types: SQLTypes + "ascii bfile bfilename bigserial bit blob dec number nvarchar nvarchar2 serial smallint string text uid varchar2 xml",
    operatorChars: "*/+-%<>!=~",
    doubleQuotedStrings: true,
    charSetCasts: true
});

export { Cassandra, MSSQL, MariaSQL, MySQL, PLSQL, PostgreSQL, SQLDialect, SQLite, StandardSQL, keywordCompletion, schemaCompletion, sql };
