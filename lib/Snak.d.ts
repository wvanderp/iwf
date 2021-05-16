import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from '@wmde/wikibase-datamodel-types';
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
    constructor(snak: WikidataSnaks);
    /**
     * @returns {boolean} true if the snak has a value
     */
    get hasValue(): boolean;
    abstract toJSON(): WikidataSnaks;
    abstract equals(other: Snak): boolean;
}
//# sourceMappingURL=Snak.d.ts.map