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
    get id(): string | undefined;
    set id(value: string | undefined);
    get numericID(): number | undefined;
    set numericID(value: number | undefined);
    /**
     *
     * @returns {WikidataWikibaseItemSnak} the snak as json
     */
    toJSON(): WikidataWikibaseItemSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {WikibaseItemSnak} a snak a
     * @param {WikibaseItemSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: WikibaseItemSnak, b: WikibaseItemSnak): boolean;
}
//# sourceMappingURL=WikibaseItemSnak.d.ts.map