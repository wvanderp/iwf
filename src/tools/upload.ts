/* eslint-disable unicorn/no-nested-ternary */
import axios from 'axios';

import qs from 'qs';
import Item from '../Item';
import { WbeditentityResponse } from '../types/apiResponse';

interface UploadOptions{
    username?: string;
    password?: string;
    authToken?: string;
    anonymous?: boolean;

    userAgent?: string;

    summary: string;
    tags: string;

    maxLag?: number;
}

type AuthMethod = 'authToken' | 'anonymous' | 'unknown'

const url = 'https://www.wikidata.org/w/api.php?action=wbeditentity&format=json';

/**
 * @private
 * @param {UploadOptions} options the options used tp configure the upload
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
                throw new Error('dont provide a authToken if you want to upload anonymously');
            }
            return 'anonymous';
        }

        /* istanbul ignore next */
        default:
            throw new Error('no auth method detected');
    }
}

/**
 *
 * @param {Item} item The item you want to upload to wikidata
 * @param {UploadOptions} options the options for uploading
 * @returns {Promise<Item>} a Promise for the item after uploading
 */
export default async function upload(item: Item, options: UploadOptions): Promise<Item> {
    const authMethod = validateAuthentication(options);

    const parameter = {
        data: JSON.stringify(item.toJSON()),
        id: item.id,
        summary: options.summary,
        token: authMethod === 'authToken' ? options.authToken : '+\\',
        tags: options.tags,
        maxlag: options.maxLag
    };

    const postString = qs.stringify(parameter);
    const {data} = await axios.post<WbeditentityResponse>(url, postString);

    if (
        data.success !== 1
        || data.error !== undefined
        || data.entity === undefined
    ) {
        throw new Error('api request went wrong');
    }

    return new Item(data.entity);
}
