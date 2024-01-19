import { LezerLanguage, LanguageSupport } from  './language';
import { Extension } from  './state';
import { Completion } from  './autocomplete';

declare type SQLDialectSpec = {
    keywords?: string;
    builtin?: string;
    types?: string;
    backslashEscapes?: boolean;
    hashComments?: boolean;
    slashComments?: boolean;
    spaceAfterDashes?: boolean;
    doubleQuotedStrings?: boolean;
    charSetCasts?: boolean;
    operatorChars?: string;
    specialVar?: string;
    identifierQuotes?: string;
};
declare class SQLDialect {
    readonly language: LezerLanguage;
    get extension(): Extension;
    static define(spec: SQLDialectSpec): SQLDialect;
}
interface SQLConfig {
    dialect?: SQLDialect;
    schema?: {
        [table: string]: readonly (string | Completion)[];
    };
    tables?: readonly Completion[];
    defaultTable?: string;
    upperCaseKeywords?: boolean;
}
declare function keywordCompletion(dialect: SQLDialect, upperCase?: boolean): Extension;
declare function schemaCompletion(config: SQLConfig): Extension;
declare function sql(config?: SQLConfig): LanguageSupport;
declare const StandardSQL: SQLDialect;
declare const PostgreSQL: SQLDialect;
declare const MySQL: SQLDialect;
declare const MariaSQL: SQLDialect;
declare const MSSQL: SQLDialect;
declare const SQLite: SQLDialect;
declare const Cassandra: SQLDialect;
declare const PLSQL: SQLDialect;

export { Cassandra, MSSQL, MariaSQL, MySQL, PLSQL, PostgreSQL, SQLConfig, SQLDialect, SQLite, StandardSQL, keywordCompletion, schemaCompletion, sql };
