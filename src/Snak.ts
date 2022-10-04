import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from '@wmde/wikibase-datamodel-types';
import { createHash } from 'crypto';
import { PString } from './types/strings';
import { isPString } from './utils/guards/strings';

/**
 * @abstract
 * @class
 */
export default abstract class Snak {
    /** a place to store the internalID so that it does not change if the contents of the object changes */
    private _internalID = '';

    snaktype: WikidataSnakType;

    property: PString;

    hash: string | undefined;

    abstract datatype: string;

    /**
     *
     * @param {WikidataSnaks} snak the snak in a json format
     * @example
     *    const snak = new Snak(json);
     */
    constructor(snak: WikidataSnaks) {
        this.snaktype = snak.snaktype;

        if (isPString(snak.property)) {
            this.property = snak.property;
        } else {
            throw new Error('property is not a PString');
        }

        this.hash = snak.hash;
    }

    /**
     * @returns {boolean} true if the snak has a value
     */
    public get hasValue(): boolean {
        return this.snaktype === 'value';
    }

    /**
     * create a unique id for the Snak
     *
     * @returns {string} the id
     */
    public get internalID(): string {
        if (this._internalID === '') {
            this._internalID = createHash('sha256')
                .update(JSON.stringify(this.toJSON()))
                .digest('hex');
        }

        return this._internalID;
    }

    abstract toJSON(): WikidataSnaks;

    abstract equals(other: Snak): boolean;
}
