import { Item as WikidataItem, Mediainfo } from '@wmde/wikibase-datamodel-types';

/**
 * guard of the json version of a wikibase item
 *
 * @private
 * @param {WikidataItem | Mediainfo} item
 * @returns {boolean} if the item is really a item
 * @example
 */
export default function isWikiMediaInfo(item: WikidataItem | Mediainfo): item is Mediainfo {
    return item.type === 'mediainfo' && item.statements !== undefined;
}
