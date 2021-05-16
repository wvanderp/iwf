import { Statement as wikidataStatement } from '@wmde/wikibase-datamodel-types';
import Reference from './Reference';
import Snak from './Snak';
/**
 * @class
 */
export default class Statement {
    /** A ID for using things that don't have an ID */
    internalID: string;
    id: string | undefined;
    type: 'statement';
    rank: 'normal' | 'preferred' | 'deprecated';
    mainsnak: Snak;
    references: Reference[];
    qualifiers: Snak[];
    qualifiersOrder: string[];
    /**
     *
     * @param {wikidataStatement} statement the statement in a json format
     */
    constructor(statement: wikidataStatement);
    /**
     * @returns {wikidataStatement} the statement in a json format
     */
    toJSON(): wikidataStatement;
    /**
     * creates a statement from a snak
     *
     * @param {Snak} snak the snak for the statement
     * @returns {Statement} the statement
     */
    static fromSnak(snak: Snak): Statement;
    /**
     *
     * @param {Statement} a the first statement
     * @param {Statement} b the second statement
     * @returns {boolean} if the two statements are equal
     */
    static equals(a: Statement, b: Statement): boolean;
    /**
     *
     * @param {Statement} a the first statement
     * @param {Statement} b the second statement
     * @returns {boolean} if the two statements are equal
     */
    static deepEquals(a: Statement, b: Statement): boolean;
}
//# sourceMappingURL=Statement.d.ts.map