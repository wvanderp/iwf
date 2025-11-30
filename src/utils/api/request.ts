import axios from 'axios';
import { WikidataResponse } from '@wmde/wikibase-datamodel-types';
import Item from '../../Item';
import { isQString } from '../guards/strings';

import PackageJSON from '../../../package.json';

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
 * @property {string} userAgent The user-agent string to use for requests.
 * @example
 *     const config = {
 *        server: 'https://www.wikidata.org',
 *        userAgent: 'YourApp/1.0'
 *    }
 *     const item = requestItem('Q42', config);
 */
interface RequestConfig {
    server?: string;
    userAgent?: string;
}

/**
 * @param {string} qid The ID of the entity.
 * @param {RequestConfig} config The config object.
 * @returns {Promise<Item>} The promise of a Wikidata Item.
 * @example
 *     const item = requestItem('Q42');
 *     const item = requestItem('Q42', { userAgent: 'YourApp/1.0' });
 */
export default async function requestItem(qid: string, config?: RequestConfig): Promise<Item> {
    if (!qid) throw new Error('No QID provided');
    if (!isQString(qid.toUpperCase())) throw new Error('QID is not a string');

    const defaultUserAgent = `iwf/${PackageJSON.version}`;

    const userAgent = config?.userAgent || defaultUserAgent;
    if (!config?.userAgent) {
        // eslint-disable-next-line no-console
        console.log(`Using default user-agent: ${defaultUserAgent}. `
            + 'Consider setting a custom user-agent to identify your application.');
    }

    const url = baseURL(qid, config?.server);
    const { data } = await axios.get<WikidataResponse>(url, {
        headers: { 'User-Agent': userAgent }
    });

    const statementData = Object.values(data.entities)[0];

    return new Item(statementData);
}
