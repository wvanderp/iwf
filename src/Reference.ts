import { Reference as WikidataReference, ReferenceSnaks as wikidataReferenceSnaks, Snaks } from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import Snak from './Snak';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';

/**
 * Reduces an array of snaks into a object grouped by PropertyID
 *
 * @param {object} accumulator the accumulator object
 * @param {Snak} value the Snak
 * @returns {object} an Object with groups of snaks by ID
 * @example
 */
function groupByPropertyReducer(accumulator: Record<string, Snaks[]>, value: Snaks): Record<string, Snaks[]> {
    if (accumulator[value.property] === undefined) {
        accumulator[value.property] = [];
    }

    accumulator[value.property].push(value);
    return accumulator;
}

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
     * @example
     */
    constructor(reference: WikidataReference) {
        this.hash = reference.hash;
        this.snaksOrder = reference['snaks-order'];
        this.internalID = uuidv4();

        this.snaks = Object.values(reference.snaks)
            .flat()
            .map((snak) => snakGenerator(snak));
    }

    /**
     * @returns {WikidataReference} the Reference in a json format
     * @example
     */
    toJSON(): WikidataReference {
        return normalizeOutput({
            hash: this.hash,
            snaks: this.snaks
                .map((snak) => snak.toJSON())
                .reduce<wikidataReferenceSnaks>(
                (accumulator, value) => groupByPropertyReducer(accumulator, value),
                {}
            ),
            'snaks-order': this.snaksOrder
        });
    }

    /**
     * this function checks if References are equal
     *
     * @param {Reference} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *     const reference = Reference.fromSnaks([
     *        new Snak('P123', 'Q42'),
     *        new Snak('P456', 'Q43')
     *    ]);
     *
     *   const reference2 = Reference.fromSnaks([
     *       new Snak('P123', 'Q42')
     *   ]);
     *
     *   reference.equals(reference2); // false
     */
    equals(other: Reference): boolean {
        return arrayEqualWith(this.snaks, other.snaks, (a: Snak, b: Snak) => a.equals(b))
            && arrayEqual(this.snaksOrder, other.snaksOrder)
            && this.hash === other.hash;
    }

    /**
     * creates a new reference from snaks
     *
     * @static
     * @param {Snak} snaks the snaks for the reference
     * @returns {Reference} the reference objects
     * @example
     */
    static fromSnaks(snaks: Snak[]): Reference {
        return new Reference({
            snaks: snaks
                .map((snak) => snak.toJSON())
                .reduce<wikidataReferenceSnaks>(
                (accumulator, value) => groupByPropertyReducer(accumulator, value),
                {}
            )
        });
    }
}
