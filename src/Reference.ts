import { Reference as WikidataReference, ReferenceSnaks as wikidataReferenceSnaks, Snaks } from '@wmde/wikibase-datamodel-types';

import Snak from './Snak';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';
import sha256 from './utils/hash';

/**
 * Reduces an array of snaks into an object grouped by PropertyID.
 *
 * @private
 * @param {Record<string, Snaks[]>} accumulator The accumulator object.
 * @param {Snaks} value The Snak.
 * @returns {Record<string, Snaks[]>} An object with groups of snaks by ID.
 */
function groupByPropertyReducer(accumulator: Record<string, Snaks[]>, value: Snaks): Record<string, Snaks[]> {
    if (accumulator[value.property] === undefined) {
        accumulator[value.property] = [];
    }

    accumulator[value.property].push(value);
    return accumulator;
}

/**
 * A class for References.
 *
 * @class
 */
export default class Reference {
    /** A place to store the internalID so that it does not change if the contents of the object change. */
    private _internalID = '';

    hash: string | undefined;

    snaksOrder: string[] | undefined;

    snaks: Snak[];

    /**
     * @param {WikidataReference} reference The Reference in JSON format.
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
     * Creates a unique ID for the Reference.
     *
     * @returns {string} The ID.
     */
    public get internalID(): string {
        if (this._internalID === '') {
            this._internalID = sha256(JSON.stringify(this.toJSON()));
        }

        return this._internalID;
    }

    /**
     * @returns {WikidataReference} The Reference in a JSON format.
     * @example
     *      const json = reference.toJSON();
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
     * Checks if References are equal.
     *
     * @param {Reference} other The other Reference.
     * @returns {boolean} True if the References are equal.
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
     * Creates a new Reference from snaks.
     *
     * @static
     * @param {Snak[]} snaks The snaks for the Reference.
     * @returns {Reference} The Reference object.
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
