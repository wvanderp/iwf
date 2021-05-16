import { WikibaseItemSnak as WikidataWikibaseItemSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the WikibaseItemSnak
 *
 * most used property of this type P2860 (cites work)
 *
 * @class
 */
export default class WikibaseItemSnak extends Snak {
    private _numericID;
    datatype: string;
    /**
     * @param {WikidataWikibaseItemSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataWikibaseItemSnak);
    /**
     * @alias id
     * @returns {string | undefined} the value of the snak
     */
    get id(): string | undefined;
    /**
     * @alias id
     * @param {string | undefined} value the value of the snak
     */
    set id(value: string | undefined);
    /**
     * @alias numericID
     * @returns {number | undefined} the value of the snak
     */
    get numericID(): number | undefined;
    /**
     * @alias numericID
     * @param {number | undefined} value the value of the snak
     */
    set numericID(value: number | undefined);
    /**
     *
     * @returns {WikidataWikibaseItemSnak} the snak as json
     */
    toJSON(): WikidataWikibaseItemSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {WikibaseItemSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: WikibaseItemSnak): boolean;
}
//# sourceMappingURL=WikibaseItemSnak.d.ts.map