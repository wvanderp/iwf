import axios from 'axios';
import {
    WikiCommonsResponse, WikidataResponse,
    Item as WikidataItem,
    Mediainfo as WikidataMediainfo
} from '@wmde/wikibase-datamodel-types';
import Item from '../../Item';
import Mediainfo from '../../MediaInfo';
import domains from './domains';
import ItemLike from '../../ItemLike';
import isWikidataItem from '../../types/guards/ItemGuard';

/**
 * @private
 * @param {string} qid the id of the entity
 * @param {RequestOptions} options the request options
 * @returns {string} the url with qid
 * @example
 */
export function baseURL(qid: string, options?: RequestOptions): string {
    const domainOption = options?.domain ?? 'wikidata';
    const domain = domains[domainOption];
    return `${domain}/wiki/Special:EntityData/${qid}.json`;
}

interface RequestOptions {
    domain?: keyof typeof domains;
}

/**
 * @param {string} qid the id of the entity
 * @param {RequestOptions} [options] options for the request
 * @returns {Promise<ItemLike>} the promise of a wikidata Item or a wikicommons item while using the commons domain option
 * @example
 *      const item = requestItem('Q42')
 */
export default async function requestItem(qid: string, options?: RequestOptions): Promise<ItemLike> {
    const url = baseURL(qid, options);
    const { data } = await axios.get<WikidataResponse | WikiCommonsResponse>(url);

    const statementData = Object.values(data.entities)[0] as WikidataItem | WikidataMediainfo;

    return isWikidataItem(statementData) ? new Item(statementData) : new Mediainfo(statementData);
}
