/* eslint-disable unicorn/no-nested-ternary */
import axios from 'axios';
import qs from 'qs';

import Item from '../../Item';
import { WbeditentityResponse } from '../../types/apiResponse';
import requestItem from './request';
import { Token } from './token';
import { StatementChange } from '../diff/statementsDiff';
import isStatementChange from '../guards/Changes';
import { UploadFormat } from '../../types/uploadFormat';

/**
 * Api Documentation is scarce. so here is a semi comprehensive list of all pages that contain information about the api
 * - https://www.mediawiki.org/wiki/Wikibase/API
 * - https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity
 *
 */

interface UploadOptions {
    username?: string;
    password?: string;
    authToken?: Token;
    anonymous?: boolean;

    userAgent?: string;

    summary: string;
    tags?: string[];

    maxLag?: number;
}

type AuthMethod = 'authToken' | 'anonymous' | 'unknown';

const url = 'https://www.wikidata.org/w/api.php?action=wbeditentity&format=json';

/**
 * @private
 * @param {UploadOptions} options the options used tp configure the upload
 * @throws {Error} if no authentication method is provided
 * @returns {AuthMethod} the method used for authentication
 */
export function validateAuthentication(options: UploadOptions): AuthMethod {
    // decide the most likely auth methods we use it later to check the all requirements for the auth methods are met
    const authMethod: AuthMethod = options.anonymous
        ? 'anonymous'
        : options.authToken
            ? 'authToken'
            : 'unknown';

    switch (authMethod) {
        case 'unknown': {
            throw new Error('you need to provide a auth method. either authToken or upload anonymously');
        }

        case 'authToken': {
            return 'authToken';
        }

        case 'anonymous': {
            if (options.authToken && options.anonymous) {
                throw new Error('don\'t provide a authToken if you want to upload anonymously');
            }
            return 'anonymous';
        }

        default: {
            throw new Error('no auth method detected');
        }
    }
}

/**
 * this function generates the object to upload to the wikidata api
 * it diffs the old item with the new item and uses that data to see witch properties have been removed
 * because removed properties need special syntax
 *
 * @private
 * @throws {Error} if an invalid authentication method is provided
 * @param {Item} item the item to upload
 */
export async function generateUploadData(item: Item): Promise<Record<string, unknown>> {
    // get diff from the original item
    const originalItem = item.id ? await requestItem(item.id) : Item.fromNothing();

    const diffs = originalItem.diff(item);

    // eslint-disable-next-line unicorn/prevent-abbreviations
    const getData = (i: Item): UploadFormat => i.toJSON();

    const json = getData(item);

    // applying the removed items from the diff to the upload data
    const removedStatements = diffs.filter((diff) => isStatementChange(diff) && diff.action === 'remove') as StatementChange[];

    for (const removedStatement of removedStatements) {
        if (!removedStatement.old?.id) {
            // you don't have to remove statements that were never uploaded
            continue;
        }

        if (!json.claims[removedStatement.old.mainsnak.property]) {
            json.claims[removedStatement.old.mainsnak.property] = [];
        }
        json.claims[removedStatement.old.mainsnak.property].push({ remove: '', id: removedStatement.old.id });
    }

    return json;
}

/**
 *
 * @param {Item} item The item you want to upload to wikidata
 * @param {UploadOptions} options the options for uploading
 * @throws {Error} if no authentication method is provided or the upload fails
 * @returns {Promise<Item>} a Promise for the item after uploading
 * @example
 *      const token = await getToken('your wikidata username', 'your wikidata password');
 *      upload(item, {
 *          summary: 'test update',
 *          authToken: token
 *      });
 */
export default async function upload(item: Item, options: UploadOptions): Promise<Item> {
    const authMethod = validateAuthentication(options);

    const authToken = authMethod === 'authToken' ? options.authToken?.token : '+\\';

    const data = await generateUploadData(item);

    const parameters = {
        tags: options.tags,
        data: JSON.stringify(data),
        id: item.id,
        summary: options.summary,
        token: authToken,
        maxlag: options.maxLag
    };

    const postString = qs.stringify(parameters, { arrayFormat: 'repeat' });
    const headers = authMethod === 'authToken' && options.authToken ? { Cookie: options.authToken.cookie } : undefined;

    const response = await axios.post<WbeditentityResponse>(
        url,
        postString,
        { headers }
    );

    const { data: responseData } = response;

    if (
        responseData.success !== 1
        || responseData.error !== undefined
        || responseData.entity === undefined
    ) {
        // eslint-disable-next-line no-console
        console.error(responseData.error);
        throw new Error('api request went wrong');
    }

    return new Item(responseData.entity);
}
