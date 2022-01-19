import axios from 'axios';
import { WikidataResponse } from '@wmde/wikibase-datamodel-types';
import Item from '../Item';

/**
 * @private
 * @param {string} qid the id of the entity
 * @returns {string} the url with qid
 * @example
 */
export function baseURL(qid: string): string {
    return `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
}

/**
 * @param {string} qid the id of the entity
 * @returns {Promise<Item>} the promise of a wikidata Item
 * @example
 *      const item = requestItem('Q42')
 */
export default async function requestItem(qid: string): Promise<Item> {
    const url = baseURL(qid);
    const { data } = await axios.get<WikidataResponse>(url);

    const statementData = Object.values(data.entities)[0];

    return new Item(statementData);
}
