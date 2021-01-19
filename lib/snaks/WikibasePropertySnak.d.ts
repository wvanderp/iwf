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
    get id(): string | undefined;
    set id(value: string | undefined);
    get numericID(): number | undefined;
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