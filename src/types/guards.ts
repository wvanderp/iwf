import { Item as WikidataItem, Mediainfo } from '@wmde/wikibase-datamodel-types';

/**
 * guard of the json version of a wikibase item
 *
 * @private
 * @param {WikidataItem | Mediainfo} item
 * @returns {boolean} if the item is really a item
 * @example
 */
export default function isWikidataItem(item: WikidataItem | Mediainfo): item is WikidataItem {
    return item.type === 'item' && item.aliases !== undefined;
}
