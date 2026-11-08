import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';

import Item from '../../Item';
import { WbeditentityResponse } from '../../types/apiResponse';
import { WbeditentityResponseSchema } from '../../schemas/wikidata';
import { StatementChange } from '../diff/statementsDiff';
import isStatementChange from '../guards/Changes';
import { UploadFormat } from '../../types/uploadFormat';
import { AliasChange } from '../diff/aliasDiff';
import { LabelChange } from '../diff/labelDiff';
import { SiteLinkChange } from '../diff/siteLinkDiff';
import { AuthProvider } from '../../auth/types';
import { APIError, mapAPIError } from '../../auth/errors';

import corsCheck from './corsCheck';
import requestItem from './request';

/**
 * API Documentation is scarce, so here is a semi-comprehensive list of all pages that contain information about the API:
 * - https://www.mediawiki.org/wiki/Wikibase/API
 * - https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity
 * - https://github.com/wikimedia/mediawiki-extensions-Wikibase/blob/master/repo/tests/phpunit/includes/Api/EditEntityTest.php
 * -- (tests are a good source of information)
 * - https://phabricator.wikimedia.org/diffusion/EWBA/browse/master/docs/change-op-serializations.wiki;d8911d30badb0df2ae9266b72e321e65fb46b998
 * -- seems outdated but is still a good source of information
 *
 * See https://phabricator.wikimedia.org/T22814 and https://noc.wikimedia.org/conf/highlight.php?file=CommonSettings.php#:~:text=%24wgCrossSiteAJAXdomains
 * for more information about CORS and why the Wikimedia servers block CORS requests from non-Wikimedia domains.
 */

interface CommonUploadOptions {
    summary: string; // The summary for the edit (displayed in the history of Wikidata)
    tags?: string[]; // The tags for the edit (displayed in the history of Wikidata)

    maxLag?: number; // The max lag in seconds for the API request (see https://www.mediawiki.org/wiki/Manual:Maxlag_parameter)

    /** Reviewed revision sent as baserevid. Known stale revisions fail before posting; conflicts are never retried. */
    baseRevisionId?: number;
    server?: string; // The API endpoint to use (defaults to Wikidata)
    origin?: string; // The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)

    axiosOptions?: AxiosRequestConfig; // The options to pass to axios
    userAgent?: string; // The user agent to use for the request (required for anonymous uploads)
}

/** Upload settings with mutually exclusive authenticated and anonymous sessions. */
export type UploadOptions = CommonUploadOptions & (
    | {
        auth: AuthProvider;
        anonymous?: false;
        /** Require a registered user or bot account for this authenticated edit. */
        assert?: 'user' | 'bot';
    }
    | {
        auth?: never;
        anonymous: true;
        /** Require an anonymous session for this edit. */
        assert?: 'anon';
    }
);

type AuthMethod = 'auth' | 'anonymous';

/**
 * Generates the URL for the API request.
 * @private
 * @param {string} server The server to request from
 * @param {boolean} isNewItem If the item is new or not
 * @param {string} [origin] The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)
 * @returns {string} The URL to request from
 * @example
 *     const url = generateURL('https://www.wikidata.org');
 *    // url = 'https://www.wikidata.org/w/api.php?action=wbeditentity&format=json'
 *    const url = generateURL('https://wiki.openstreetmap.org');
 *   // url = 'https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json'
 */
export function generateURL(server: string, isNewItem: boolean, origin?: string): string {
    const serverDomain = new URL(server);
    const base = `${serverDomain.origin}/w/api.php`;

    const urlParameters = {
        action: 'wbeditentity',
        format: 'json',

        // You need to include this if the item is new
        new: isNewItem ? 'item' : undefined,
        origin: origin ?? undefined
    };

    return `${base}?${stringify(urlParameters, { arrayFormat: 'repeat' })}`;
}

/**
 * Applies statement removals to the upload payload.
 *
 * @param json The upload payload to mutate.
 * @param diffs The item diffs to apply.
 * @example
 *     applyRemovedStatements(json, diffs);
 */
function applyRemovedStatements(json: UploadFormat, diffs: ReturnType<Item['diff']>): void {
    const removedStatements = diffs.filter((diff) => isStatementChange(diff) && diff.action === 'remove') as StatementChange[];

    for (const removedStatement of removedStatements) {
        if (!removedStatement.old?.id) {
            continue;
        }

        if (!json.claims[removedStatement.old.mainsnak.property]) {
            json.claims[removedStatement.old.mainsnak.property] = [];
        }

        json.claims[removedStatement.old.mainsnak.property].push({ remove: '', id: removedStatement.old.id });
    }
}

/**
 * Applies alias removals to the upload payload.
 *
 * @param json The upload payload to mutate.
 * @param diffs The item diffs to apply.
 * @example
 *     applyRemovedAliases(json, diffs);
 */
function applyRemovedAliases(json: UploadFormat, diffs: ReturnType<Item['diff']>): void {
    const removedAliases = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'alias') as AliasChange[];

    for (const removedAlias of removedAliases) {
        if (removedAlias.old?.language && removedAlias.old.value) {
            if (!json.aliases[removedAlias.old.language]) {
                json.aliases[removedAlias.old.language] = [];
            }

            json.aliases[removedAlias.old.language].push({
                language: removedAlias.old.language,
                value: removedAlias.old.value,
                remove: ''
            });
        }
    }
}

/**
 * Applies label removals to the upload payload.
 *
 * @param json The upload payload to mutate.
 * @param diffs The item diffs to apply.
 * @example
 *     applyRemovedLabels(json, diffs);
 */
function applyRemovedLabels(json: UploadFormat, diffs: ReturnType<Item['diff']>): void {
    const removedLabels = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'label') as LabelChange[];

    for (const removedLabel of removedLabels) {
        if (removedLabel.old?.language && removedLabel.old.value) {
            json.labels[removedLabel.old.language] = { language: removedLabel.old.language, value: '' };
        }
    }
}

/**
 * Applies description removals to the upload payload.
 *
 * @param json The upload payload to mutate.
 * @param diffs The item diffs to apply.
 * @example
 *     applyRemovedDescriptions(json, diffs);
 */
function applyRemovedDescriptions(json: UploadFormat, diffs: ReturnType<Item['diff']>): void {
    const removedDescriptions = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'description') as LabelChange[];

    for (const removedDescription of removedDescriptions) {
        if (removedDescription.old?.language && removedDescription.old.value) {
            json.descriptions[removedDescription.old.language] = {
                language: removedDescription.old.language,
                value: ''
            };
        }
    }
}

/**
 * Applies sitelink removals to the upload payload.
 *
 * @param json The upload payload to mutate.
 * @param diffs The item diffs to apply.
 * @example
 *     applyRemovedSitelinks(json, diffs);
 */
function applyRemovedSitelinks(json: UploadFormat, diffs: ReturnType<Item['diff']>): void {
    const removedSitelinks = diffs.filter((diff) => diff.action === 'remove' && diff.type === 'siteLink') as SiteLinkChange[];

    for (const removedSitelink of removedSitelinks) {
        if (removedSitelink.old?.site && removedSitelink.old.title) {
            json.sitelinks[removedSitelink.old.site] = { site: removedSitelink.old.site, title: '' };
        }
    }
}

/**
 * @private
 * @param {UploadOptions} options The options used to configure the upload
 * @throws {Error} If no authentication method is provided or conflicting options are set
 * @returns {AuthMethod} The method used for authentication
 */
export function validateAuthentication(options: UploadOptions): AuthMethod {
    if (options.anonymous && options.auth) {
        throw new Error('Don\'t provide auth if you want to upload anonymously.');
    }

    if (options.anonymous) {
        if (options.assert !== undefined && options.assert !== 'anon') {
            throw new TypeError('Anonymous uploads only support assert: "anon".');
        }
        return 'anonymous';
    }

    if (options.auth) {
        if (options.assert !== undefined && options.assert !== 'user' && options.assert !== 'bot') {
            throw new TypeError('Authenticated uploads only support assert: "user" or "bot".');
        }
        return 'auth';
    }

    throw new Error('Provide an AuthProvider through auth, or set anonymous to true.');
}

/**
 * This function generates the object to upload to the Wikidata API.
 * It diffs the old item with the new item and uses that data to see which properties have been removed.
 * Because removed properties need special syntax.
 *
 * @private
 * @throws {Error} If an invalid authentication method is provided
 * @param {Item} item The item to upload
 * @param {string} server The server to request from
 * @param [baseRevisionId] Reviewed revision; a mismatch with the fetched revision rejects the upload
 * @param [userAgent] User-Agent to identify the application during the preflight request
 * @returns {Promise<UploadFormat>} The data to upload
 */
export async function generateUploadData(
    item: Item,
    server: string,
    baseRevisionId?: number,
    userAgent?: string
): Promise<UploadFormat> {
    validateBaseRevisionId(item, baseRevisionId);
    // Public model fields can be edited after construction. Validate the full
    // entity before any preflight request or removal markers are introduced.
    item = new Item(item.toJSON());

    // Get diff from the original item
    const originalItem = item.id ? await requestItem(item.id, { server, userAgent }) : Item.fromNothing();

    if (baseRevisionId !== undefined && originalItem.lastrevid !== baseRevisionId) {
        throw new APIError('The item changed since the reviewed revision. Fetch and review it again.', 'editconflict');
    }

    const diffs = originalItem.diff(item);

    const json = item.toJSON();

    applyRemovedStatements(json, diffs);
    applyRemovedAliases(json, diffs);
    applyRemovedLabels(json, diffs);
    applyRemovedDescriptions(json, diffs);
    applyRemovedSitelinks(json, diffs);

    return json;
}

/**
 * Rejects reviewed revisions for items that do not exist yet.
 *
 * @param item The item to upload.
 * @param baseRevisionId The caller's reviewed revision.
 * @throws {TypeError} If a new item has a base revision.
 * @example
 *     validateBaseRevisionId(existingItem, 123);
 */
function validateBaseRevisionId(item: Item, baseRevisionId?: number): void {
    if (baseRevisionId !== undefined && !item.id) {
        throw new TypeError('baseRevisionId can only be used with an existing item that has an ID.');
    }
}

/**
 * Uploads an Item to a Wikibase instance (e.g., Wikidata)
 *
 * @param item The item you want to upload to Wikidata
 * @param options The options for uploading
 * @param options.summary The summary for the edit (displayed in the history of Wikidata)
 * @param [options.tags] The tags for the edit (displayed in the history of Wikidata)
 * @param [options.auth] The authentication provider to use
 * @param [options.anonymous] If true, the upload will be anonymous
 * @param [options.maxLag] The max lag in seconds for the API request (see https://www.mediawiki.org/wiki/Manual:Maxlag_parameter)
 * @param [options.baseRevisionId] Reviewed revision to check and send as baserevid; never replaced with a fetched revision
 * @param [options.assert] Session assertion sent to the API (user, bot, or anon)
 * @param [options.server] The API endpoint to use (defaults to Wikidata)
 * @param [options.origin] The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)
 * @param [options.axiosOptions] The options to pass to axios
 * @param [options.userAgent] The user agent to use for the request (required for anonymous uploads)
 * @throws {Error} If input or response data fails Wikidata schema validation, no authentication method is provided, or the upload fails
 * @returns A Promise for the item after uploading
 * @example
 *      // Using BotPasswordAuth (recommended)
 *      const auth = new BotPasswordAuth({
 *          username: 'MainAccount@BotName',
 *          password: 'botpassword123',
 *          userAgent: 'MyBot/1.0'
 *      });
 *      await upload(item, {
 *          summary: 'test update',
 *          auth
 *      });
 *
 * @example
 *      // Anonymous upload
 *      await upload(item, {
 *          summary: 'anonymous edit',
 *          anonymous: true,
 *          origin: 'https://my-app.example.com',
 *          userAgent: 'MyApp/1.0'
 *      });
 */
export default async function upload(item: Item, options: UploadOptions): Promise<Item> {
    validateBaseRevisionId(item, options.baseRevisionId);
    item = new Item(item.toJSON());

    const authMethod = validateAuthentication(options);

    const server = options.server ?? 'https://www.wikidata.org';

    // Determine user agent
    let userAgent: string | undefined;
    if (authMethod === 'auth' && options.auth) {
        userAgent = options.auth.getUserAgent();
    } else if (options.userAgent) {
        userAgent = options.userAgent;
    }

    // Get token and axios instance based on auth method
    let csrfToken: string;
    let axiosInstance: AxiosInstance;

    if (authMethod === 'auth' && options.auth) {
        // Use the provider's authenticated CSRF token and client
        csrfToken = await options.auth.getCsrfToken(server);
        axiosInstance = options.auth.getAxiosInstance();
    } else {
        // Anonymous - use default anonymous token
        csrfToken = '+\\';
        axiosInstance = axios;
    }

    // Checking for CORS, browser, and origin
    corsCheck(server, options?.origin);

    const data = await generateUploadData(item, server, options.baseRevisionId, userAgent);

    const parameters = {
        tags: options.tags,
        data: JSON.stringify(data),
        id: item.id,
        summary: options.summary,
        token: csrfToken,
        maxlag: options.maxLag,
        baserevid: options.baseRevisionId,
        assert: options.assert
    };

    const postString = stringify(parameters, { arrayFormat: 'repeat' });

    const isNewItem = item.id === undefined;
    const url = generateURL(server, isNewItem, options.origin);

    const editEntityConfig: AxiosRequestConfig = {
        ...options.axiosOptions,
        method: 'POST',
        url,
        data: postString,
        headers: {
            ...options.axiosOptions?.headers,
            ...(userAgent ? { 'User-Agent': userAgent } : {})
        }
    };

    const response = await axiosInstance<WbeditentityResponse>(editEntityConfig);
    const { data: responseData } = response;

    if (typeof responseData?.error?.code === 'string') {
        // API descriptions and response details may echo credentials or edit content.
        throw mapAPIError(responseData.error.code, 'The upload was rejected by the API.');
    }

    if (
        responseData?.success !== 1
        || responseData.error !== undefined
        || typeof responseData.entity !== 'object'
        || !responseData.entity
        || Array.isArray(responseData.entity)
    ) {
        throw new APIError('The upload returned an invalid or unsuccessful API response.');
    }

    const validatedResponse = WbeditentityResponseSchema.parse(responseData);
    return new Item(validatedResponse.entity);
}
