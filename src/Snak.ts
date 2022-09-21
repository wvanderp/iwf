import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from '@wmde/wikibase-datamodel-types';
import { createHash } from 'crypto';

/**
 * @abstract
 * @class
 */
export default abstract class Snak {
    snaktype: WikidataSnakType;

    property: string;

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
        this.property = snak.property;

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
        return createHash('sha256')
            .update(JSON.stringify(this.toJSON()))
            .digest('hex');
    }

    abstract toJSON(): WikidataSnaks;

    abstract equals(other: Snak): boolean;
}
