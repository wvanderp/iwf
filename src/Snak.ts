import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from '@wmde/wikibase-datamodel-types';
import { PString } from './types/strings';
import { isPString } from './utils/guards/strings';
import sha256 from './utils/hash';

/**
 * @abstract
 * @class
 * Represents a Snak in the Wikidata model.
 */
export default abstract class Snak {
    /** A place to store the internalID so that it does not change if the contents of the object change. */
    private _internalID = '';

    snaktype: WikidataSnakType;

    property: PString;

    hash: string | undefined;

    abstract datatype: string;

    /**
     * Creates an instance of Snak.
     *
     * @param {WikidataSnaks} snak - The snak in a JSON format.
     * @example
     * const snak = new Snak(json);
     */
    constructor(snak: WikidataSnaks) {
        this.snaktype = snak.snaktype;

        if (isPString(snak.property)) {
            this.property = snak.property;
        } else {
            throw new Error('Property is not a PString');
        }

        this.hash = snak.hash;
    }

    /**
     * Checks if the snak has a value.
     *
     * @returns {boolean} True if the snak has a value.
     */
    public get hasValue(): boolean {
        return this.snaktype === 'value';
    }

    /**
     * Creates a unique ID for the Snak.
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
     * Converts the Snak to a JSON object.
     *
     * @returns {WikidataSnaks} The JSON representation of the Snak.
     */
    abstract toJSON(): WikidataSnaks;

    /**
     * Checks if this Snak is equal to another Snak.
     *
     * @param {Snak} other - The other Snak to compare with.
     * @returns {boolean} True if the Snaks are equal.
     */
    abstract equals(other: Snak): boolean;
}
