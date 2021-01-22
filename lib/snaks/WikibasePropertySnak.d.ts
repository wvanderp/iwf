import { WikibasePropertySnak as WikidataWikibasePropertySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the wikibase property snak
 *
 * most used property of this type P1659 (see also)
 *
 * @class
 */
export default class WikibasePropertySnak extends Snak {
    /** the numeric id of the property */
    private _numericID;
    datatype: string;
    /**
     * @param {WikidataWikibasePropertySnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataWikibasePropertySnak);
    /**
     * returns the ID of the property with the P
     *
     * @returns {string | undefined} the ID of the property with the P
     */
    get id(): string | undefined;
    /**
     * This function parses the string by slicing the first char and then number.parseInt
     * if value is undefined it also sets the snaktype to 'novalue
     *
     * @property {string | undefined} value the value that you want to set
     */
    set id(value: string | undefined);
    /**
     * returns the numeric part of the property
     *
     * @returns {number | undefined} the numeric ID of the property
     */
    get numericID(): number | undefined;
    /**
     * if value is undefined it also sets the snaktype to 'novalue
     *
     * @property {number | undefined} value the numeric id to be set in the snak
     */
    set numericID(value: number | undefined);
    /**
     *
     * @returns {WikidataWikibasePropertySnak} the snak as json
     */
    toJSON(): WikidataWikibasePropertySnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {WikibasePropertySnak} a snak a
     * @param {WikibasePropertySnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: WikibasePropertySnak, b: WikibasePropertySnak): boolean;
}
//# sourceMappingURL=WikibasePropertySnak.d.ts.map