import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * @abstract
 * @class
 */
export default abstract class Snak {
    /** A ID for using things that don't have an ID */
    internalID: string;

    snaktype: WikidataSnakType;

    property: string;

    hash: string | undefined;

    abstract datatype: string;

    /**
     *
     * @param {WikidataSnaks} snak the snak in a json format
     */
    constructor(snak: WikidataSnaks) {
        this.snaktype = snak.snaktype;
        this.property = snak.property;

        this.hash = snak.hash;
        this.internalID = uuidv4();
    }

    /**
     * @returns {boolean} true if the snak has a value
     */
    public get hasValue(): boolean {
        return this.snaktype === 'value';
    }

    abstract toJSON(): WikidataSnaks

    abstract equals(other: Snak): boolean;
}
