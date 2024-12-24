import axios from 'axios';
import { WikidataResponse } from '@wmde/wikibase-datamodel-types';
import Item from '../../Item';
import { isQString } from '../guards/strings';

/**
 * @private
 * @param {string} qid The ID of the entity.
 * @param {string} server The server to use.
 * @returns {string} The URL with QID.
 * @example
 *     const url = baseURL('Q42');
 */
export function baseURL(qid: string, server = 'https://www.wikidata.org'): string {
    const url = new URL(server);
    return `${url.origin}/wiki/Special:EntityData/${qid}.json`;
}

/**
 * @private
 * @typedef {Object} RequestConfig
 * @property {string} server The server to use.
 * @example
 *     const config = {
 *        server: 'https://www.wikidata.org'
 *    }
 *     const item = requestItem('Q42', config);
 */
interface RequestConfig {
    server: string;
}

/**
 * @param {string} qid The ID of the entity.
 * @param {RequestConfig} config The config object.
 * @returns {Promise<Item>} The promise of a Wikidata Item.
 * @example
 *     const item = requestItem('Q42');
 */
export default async function requestItem(qid: string, config?: RequestConfig): Promise<Item> {
    if (!qid) throw new Error('No QID provided');
    if (!isQString(qid.toUpperCase())) throw new Error('QID is not a string');

    const url = baseURL(qid, config?.server);
    const { data } = await axios.get<WikidataResponse>(url);

    const statementData = Object.values(data.entities)[0];

    return new Item(statementData);
}
