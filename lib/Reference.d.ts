import { Reference as WikidataReference } from '@wmde/wikibase-datamodel-types';
import Snak from './Snak';
/**
 * A class for References
 *
 * @class
 */
export default class Reference {
    /** A ID for using things that don't have an ID */
    internalID: string;
    hash: string | undefined;
    snaksOrder: string[] | undefined;
    snaks: Snak[];
    /**
     *
     * @param {WikidataReference} reference the Reference in json format
     */
    constructor(reference: WikidataReference);
    /**
     * @returns {WikidataReference} the Reference in a json format
     */
    toJSON(): WikidataReference;
    /**
     * this function checks if References are equal
     *
     * @param {Reference} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: Reference): boolean;
    /**
     * creates a new reference from snaks
     *
     * @static
     * @param {Snak} snaks the snaks for the reference
     * @returns {Reference} the reference objects
     */
    static fromSnaks(snaks: Snak[]): Reference;
}
//# sourceMappingURL=Reference.d.ts.map