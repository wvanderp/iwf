/* eslint-disable sonarjs/cognitive-complexity */
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
import { AliasChange } from '../diff/aliasDiff';
import { LabelChange } from '../diff/labelDiff';
import { SiteLinkChange } from '../diff/siteLinkDiff';

/**
 * Api Documentation is scarce. so here is a semi comprehensive list of all pages that contain information about the api
 * - https://www.mediawiki.org/wiki/Wikibase serialized object that is used as the data source. A newly cre/API
 * - https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity
 * - https://github.com/wikimedia/mediawiki-extensions-Wikibase/blob/master/repo/tests/phpunit/includes/Api/EditEntityTest.php
 * -- (tests are a good source of information)
 * - https://phabricator.wikimedia.org/diffusion/EWBA/browse/master/docs/change-op-serializations.wiki;d8911d30badb0df2ae9266b72e321e65fb46b998
 * -- seams outdated but is still a good source of information
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

    server?: string;
}

type AuthMethod = 'authToken' | 'anonymous' | 'unknown';

/**
 * generates the url for the api request
 * @private
 * @param {string} server the server to request from
 * @returns {string} the url to request from
 * @example
 *     const url = generateURL('https://www.wikidata.org');
 *    // url = 'https://www.wikidata.org/w/api.php?action=wbeditentity&format=json'
 *    const url = generateURL('https://wiki.openstreetmap.org');
 *   // url = 'https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json'
 */
export function generateURL(server = 'https://www.wikidata.org'): string {
    const url = new URL(server);
    return `${url.origin}/w/api.php?action=wbeditentity&format=json`;
}

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
 * This function generates the object to upload to the wikidata api
 * It diffs the old item with the new item and uses that data to see witch properties have been removed
 * Because removed properties need special syntax
 *
 * @private
 * @throws {Error} if an invalid authentication method is provided
 * @param {Item} item the item to upload
 */
export async function generateUploadData(item: Item, server = 'https://wikidata.org'): Promise<Record<string, unknown>> {
    // get diff from the original item/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/.md
    const originalItem = item.id ? await requestItem(item.id, { server }) : Item.fromNothing();

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

    // removing aliases
    const removedAliases = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'alias') as AliasChange[];

    for (const removedAlias of removedAliases) {
        if (removedAlias.old?.language && removedAlias.old?.value) {
            if (!json.aliases[removedAlias.old.language]) {
                json.aliases[removedAlias.old.language] = [];
            }
            json.aliases[removedAlias.old.language].push({ language: removedAlias.old.language, value: removedAlias.old.value, remove: '' });
        }
    }

    // removing labels
    const removedLabels = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'label') as LabelChange[];

    for (const removedLabel of removedLabels) {
        if (removedLabel.old?.language && removedLabel.old?.value) {
            json.labels[removedLabel.old.language] = { language: removedLabel.old.language, value: '' };
        }
    }

    // removing descriptions
    const removedDescriptions = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'description') as LabelChange[];

    for (const removedDescription of removedDescriptions) {
        if (removedDescription.old?.language && removedDescription.old?.value) {
            json.descriptions[removedDescription.old.language] = { language: removedDescription.old.language, value: '' };
        }
    }

    // removing sitelinks
    // https://github.com/wikimedia/mediawiki-extensions-Wikibase/blob/master/repo/tests/phpunit/includes/Api/EditEntityTest.php#L165
    const removedSitelinks = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'siteLink') as SiteLinkChange[];

    for (const removedSitelink of removedSitelinks) {
        if (removedSitelink.old?.site && removedSitelink.old?.title) {
            json.sitelinks[removedSitelink.old.site] = { site: removedSitelink.old.site, title: '' };
        }
    }

    return json as unknown as Record<string, unknown>;
}

/**
 *
 * @param {Item} item The item you want to upload to wikidata
 * @param {UploadOptions} options The options for uploading
 * @throws {Error} If no authentication method is provided or the upload fails
 * @returns {Promise<Item>} A Promise for the item after uploading
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

    const data = await generateUploadData(item, options.server);

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

    const url = generateURL(options.server);

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
        console.error(JSON.stringify(responseData.error, null, 2));
        throw new Error('api request went wrong');
    }

    return new Item(responseData.entity);
}
