/* eslint-disable sonarjs/no-duplicate-string */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { ActionLoginResponse, QueryMetaTokenResponse } from '../../types/apiResponse';
import corsCheck from './corsCheck';

/**
 * Generates the login URL for a given server.
 *
 * Main-account login via \"action=login\" is deprecated and may stop working without warning.
 * https://phabricator.wikimedia.org/T137805
 *
 * According to the API documentation, you need to specify a specific origin when relying on CORS.
 * https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&list=search&srsearch=meaning
 *
 * @private
 * @param {string} server The server to generate the URL for
 * @returns {string} The login URL
 * @param {string} [origin] The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)
 * @example
 *     const loginUrl = getLoginUrl('https://test.wikidata.org');
 *    // loginUrl = 'https://test.wikidata.org/w/api.php?action=login&format=json'
 */
export function loginUrl(server: string, origin?: string): string {
    const serverURL = new URL(server);
    const url = `${serverURL.origin}/w/api.php?action=login&format=json`;
    if (origin) {
        return `${url}&origin=${encodeURIComponent(origin)}`;
    }
    return url;
}

/**
 * Generates the token URL for a given server.
 *
 * @private
 * @param {string} server The server to generate the URL for
 * @returns {string} The token URL
 * @param {string} [origin] The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)
 * @example
 *    const tokenUrl = getTokenUrl('https://test.wikidata.org');
 *   // tokenUrl = 'https://test.wikidata.org/w/api.php?action=query&meta=tokens&type=csrf&format=json'
 */
export function tokenUrl(server: string, origin?: string): string {
    const serverURL = new URL(server);
    const url = `${serverURL.origin}/w/api.php?action=query&meta=tokens&type=csrf&format=json`;
    if (origin) {
        return `${url}&origin=${encodeURIComponent(origin)}`;
    }
    return url;
}

/**
 * Joins the cookies together.
 *
 * This function exists because normally the set-cookie header is an array of strings,
 * but for some reason axiosOverHttp returns a string instead of an array of strings.
 *
 * @private
 * @param {string[] | string} cookies An array or a string of cookies
 * @returns {string} The joined cookies
 */
export function joinCookies(cookies: string[] | string): string {
    if (Array.isArray(cookies)) {
        return cookies.join('; ');
    }
    return cookies;
}

/**
 * An object containing the token and the cookie used for authentication in the API calls.
 *
 * @typedef {object} Token
 * @property {string} token The token
 * @property {string} cookie The cookie
 */
export interface Token {
    token: string;
    cookie: string;
}

interface LoginResponse {
    'warnings?': {
        'main': {
            '*': string
        },
        'login': {
            '*': string
        }
    },
    'login': {
        'result': 'Failed',
        'reason': string
    } |
    {
        'result': 'Success',
        'lguserid': number,
        'lgusername': string
    }
}

interface GetTokenConfig {
    server?: string; // The Wikibase server to get the token from
    origin?: string; // The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)
    axiosOptions?: AxiosRequestConfig; // The options to pass to axios
    axiosInstance?: AxiosInstance; // The axios instance to use for login and token requests (default: axios)
}

/**
 * Use this function to retrieve tokens by using a username and password.
 *
 * If you are using this function in a browser environment, you need to specify the origin.
 * If you try to access a Wikimedia server, you need to be on a Wikimedia domain. All other domains are blocked.
 * See https://phabricator.wikimedia.org/T22814 and https://noc.wikimedia.org/conf/highlight.php?file=CommonSettings.php#:~:text=%24wgCrossSiteAJAXdomains
 *
 * You can pass in a custom axios instance to use for the requests. This is mainly intended for CORS circumvention purposes.
 * Use, for example, axios-over-http to do the actual requests on a server.
 * The only requirement for these axios instances is that they have the same API as the axios package.
 * The only required function is the main axios() function.
 *
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 *
 * @param {object} [config] The config for the function
 * @param {string} [config.server] The server to get the token from
 * @param {string} [config.origin] The origin to use for the API calls, aka the "domain" of the web app (only needed for CORS)
 * @param {AxiosRequestConfig} [config.axiosOptions] The options to pass to axios. Please use sparingly as this may be considered a hack. Please open an issue if you need this.
 * @param {AxiosInstance} [config.axiosInstance] The axios instance to use. This is mainly intended for CORS circumvention purposes. Use, for example, axios-over-http to do the actual requests on a server.
 *
 * @throws {Error} If the login was not successful
 * @returns {Token} An object containing the token and the cookie
 * @example
 *      const token = await getToken('your wikidata username', 'your wikidata password');
 *      upload(item, {
 *          summary: 'test update',
 *          authToken: token
 *      });
 */
export default async function getToken(username: string, password: string, config?: GetTokenConfig): Promise<Token> {
    // Checking the config
    const server = config?.server ?? 'https://www.wikidata.org';

    // Checking for CORS, browser and origin
    corsCheck(server, config?.origin);

    // Checking the username and password
    if (username === undefined || password === undefined || username === '' || password === '' || username === null || password === null) {
        throw new Error('Username and password are required');
    }

    // Axios instance
    // We need to have the ability to pass in a custom axios instance for CORS circumvention
    // So by default we use the axios instance from the axios package
    // The only thing needed for this is that the axios instance has the same API as the axios package
    const axiosInstance: AxiosInstance = config?.axiosInstance ?? axios;

    // Getting an edit token happens in three steps:
    // 1. Get a login token and cookie
    // 2. Use this token to login
    // 3. Use the cookie you get from logging in to get an edit token
    // Then use the token and cookie together in all future API calls

    // Getting the login cookie & token
    const body = qs.stringify({ username, password });

    const cookieConfig: AxiosRequestConfig = {
        ...config?.axiosOptions,
        method: 'POST',
        url: loginUrl(server, config?.origin),
        data: body,
    };

    const cookieResult = await axiosInstance<ActionLoginResponse>(cookieConfig);

    if (cookieResult.data.login.result === 'Aborted') {
        throw new Error(`Getting login token ${cookieResult.data.login.result}: ${cookieResult.data.login.reason}`);
    }

    const { token: loginToken } = cookieResult.data.login;

    if (cookieResult.headers['set-cookie'] === undefined) {
        throw new Error('Cannot login: no login token received');
    }

    const cookies = joinCookies(cookieResult.headers['set-cookie']);

    if (cookies === undefined) {
        throw new Error('Cannot login: no cookies received');
    }

    // Logging in
    const loginHeaders = {
        Cookie: cookies
    };
    const loginBody = qs.stringify({ lgname: username, lgpassword: password, lgtoken: loginToken });

    const loginConfig: AxiosRequestConfig = {
        ...config?.axiosOptions,
        method: 'POST',
        url: loginUrl(server, config?.origin),
        data: loginBody,
        headers: {
            ...config?.axiosOptions?.headers,
            ...loginHeaders
        }
    };

    const loginResult = await axiosInstance<LoginResponse>(loginConfig);

    if (loginResult.data.login.result !== 'Success') {
        throw new Error(`Logging in ${loginResult.data.login.result}: ${loginResult.data.login.reason}`);
    }

    if (loginResult.headers['set-cookie'] === undefined) {
        throw new Error('Cannot login: no login cookies received');
    }

    const loginCookies = joinCookies(loginResult.headers['set-cookie']);

    // Getting the token
    const tokenCookies = loginCookies ?? '';
    const tokenConfig = {
        ...config?.axiosOptions,
        method: 'GET',
        url: tokenUrl(server, config?.origin),
        headers: {
            ...config?.axiosOptions?.headers,
            Cookie: tokenCookies
        }
    };
    const tokenResult = await axiosInstance<QueryMetaTokenResponse>(tokenConfig);

    return {
        token: tokenResult.data.query.tokens.csrftoken,
        cookie: tokenCookies
    };
}
