import { Reference as WikidataReference, ReferenceSnaks as wikidataReferenceSnaks, Snaks } from '@wmde/wikibase-datamodel-types';

import Snak from './Snak';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';
import sha256 from './utils/hash';

/**
 * Reduces an array of snaks into a object grouped by PropertyID
 *
 * @private
 * @param {object} accumulator the accumulator object
 * @param {Snak} value the Snak
 * @returns {object} an Object with groups of snaks by ID
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
    /** a place to store the internalID so that it does not change if the contents of the object changes */
    private _internalID = '';

    hash: string | undefined;

    snaksOrder: string[] | undefined;

    snaks: Snak[];

    /**
     *
     * @param {WikidataReference} reference the Reference in json format
     * @example
     *   const reference = new Reference(json);
     */
    constructor(reference: WikidataReference) {
        this.hash = reference.hash;
        this.snaksOrder = reference['snaks-order'];

        this.snaks = Object.values(reference.snaks)
            .flat()
            .map((snak) => snakGenerator(snak));
    }

    /**
     * create a unique id for the Reference
     *
     * @returns {string} the id
     */
    public get internalID(): string {
        if (this._internalID === '') {
            this._internalID = sha256(JSON.stringify(this.toJSON()));
        }

        return this._internalID;
    }

    /**
     * @returns {WikidataReference} the Reference in a json format
     * @example
     *      const json = reference.toJson();
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
     *    const reference = Reference.fromSnaks([
     *       new Snak('P123', 'Q42'),
     *       new Snak('P456', 'Q43')
     *    ]);
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
