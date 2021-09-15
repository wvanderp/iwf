import { Item as WikidataItem } from '@wmde/wikibase-datamodel-types';
import Alias from './Alias';
import Statement from './Statement';
import Description from './Description';
import Label from './Label';
import SiteLink from './SiteLink';
/**
 * @class
 */
export default class Item {
    /** A ID for using things that don't have an ID */
    internalID: string;
    pageid: number;
    ns: number;
    title: string;
    lastrevid: number;
    modified: Date;
    type: 'item';
    id: string;
    labels: Label[];
    descriptions: Description[];
    aliases: Alias[];
    statements: Statement[];
    sitelinks: SiteLink[];
    /**
     *
     * @param {WikidataItem} item the item in json format
     */
    constructor(item: WikidataItem);
    /**
     * this function checks if two items are equal
     *
     * @param {Item} other the other item
     * @returns {boolean} true if the items are equal
     */
    equals(other: Item): boolean;
    /**
     *
     * @param other the other item
     */
    /**
     * @returns {WikidataItem} the item as json
     */
    toJSON(): WikidataItem;
}
//# sourceMappingURL=Item.d.ts.map