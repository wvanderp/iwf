import { TabularDataSnak as WikidataTabularDataSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the TabularDataSnak
 *
 * most used property of this type P4150 (weather history)
 *
 * @class
 */
export default class TabularDataSnak extends Snak {
    value: string | undefined;
    datatype: string;
    /**
     * @param {WikidataTabularDataSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataTabularDataSnak);
    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    get commonsLink(): string;
    /**
     *
     * @returns {WikidataTabularDataSnak} the snak as json
     */
    toJSON(): WikidataTabularDataSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {TabularDataSnak} a snak a
     * @param {TabularDataSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: TabularDataSnak, b: TabularDataSnak): boolean;
}
//# sourceMappingURL=TabularDataSnak.d.ts.map