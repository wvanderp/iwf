import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { ActionLoginResponse, QueryMetaTokenResponse } from '../../types/apiResponse';

/**
 * Generates the login url for a given server
 *
 * Main-account login via \"action=login\" is deprecated and may stop working without warning.
 * https://phabricator.wikimedia.org/T137805
 *
 * According to the api documentation you need to specify a specific origin when relying on cors
 * https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&list=search&srsearch=meaning
 *
 * @private
 * @param {string} server The server to generate the url for
 * @returns {string} The login url
 * @param {string} [origin] The origin to use for the api calls aka the "domain" of the webapp (only needed for cors)
 * @example
 *     const loginUrl = getLoginUrl('https://test.wikidata.org');
 *    // loginUrl = 'https://test.wikidata.org/w/api.php?action=login&format=json'
 */
export function loginUrl(server: string, origin?: string): string {
    const serverURL = new URL(server);
    const url = `${serverURL.origin}/w/api.php?action=login&format=json`;
    if (origin) {
        return `${url}&origin=${origin}`;
    }
    return url;
}

/**
 * Generates the token url for a given server
 *
 * @private
 * @param {string} server the server to generate the url for
 * @returns {string} the token url
 * @param {string} [origin] The origin to use for the api calls aka the "domain" of the webapp (only needed for cors)
 * @example
 *    const tokenUrl = getTokenUrl('https://test.wikidata.org');
 *   // tokenUrl = 'https://test.wikidata.org/w/api.php?action=query&meta=tokens&type=csrf&format=json'
 */
export function tokenUrl(server: string, origin?: string): string {
    const serverURL = new URL(server);
    const url = `${serverURL.origin}/w/api.php?action=query&meta=tokens&type=csrf&format=json`;
    if (origin) {
        return `${url}&origin=${origin}`;
    }
    return url;
}

/**
 * a object containing the token and the cookie used for authentication in the api calls
 *
 * @typedef {object} Token
 * @property {string} token the token
 * @property {string} cookie the cookie
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
    server?: string; // The wikibase server to get the token from
    origin?: string; // The origin to use for the api calls aka the "domain" of the webapp (only needed for cors),
    axiosOptions?: AxiosRequestConfig; // The options to pass to axios
    axiosInstance?: AxiosInstance; // The axios instance to use for login and token requests (default: axios)
}

/**
 * Use this function to retrieve tokens by using a username and password.
 *
 * If you are using this function in a browser environment you need to specify the origin.
 * If you try to access a wikimedia server you need to be on a wikimedia domain. all other domains are blocked.
 * see https://phabricator.wikimedia.org/T22814 and https://noc.wikimedia.org/conf/highlight.php?file=CommonSettings.php#:~:text=%24wgCrossSiteAJAXdomains
 *
 * you can pass in a custom axios instance to use for the requests. this is mainly intended for cors circumvention purposes.
 * use for example axios-over-http to do the actual requests on a server.
 * the only requirement for these axios instances is that they have the same api as the axios package.
 * the only required function is the main axios() function.
 *
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 *
 * @param {object} [config] The config for the function
 * @param {string} [config.server] The server to get the token from
 * @param {string} [config.origin] The origin to use for the api calls aka the "domain" of the webapp (only needed for cors)
 * @param {AxiosRequestConfig} [config.axiosOptions] The options to pass to axios. Please use sparingly as this may be considered a hack. Please open a issue if you need this.
 * @param {AxiosInstance} [config.axiosInstance] The axios instance to use.this is mainly intended for cors circumvention purposes. use for example axios-over-http to do the actual requests on a server.
 *
 * @throws {Error} If the login was not successful
 * @returns {Token} A object containing the token and the cookie
 * @example
 *      const token = await getToken('your wikidata username', 'your wikidata password');
 *      upload(item, {
 *          summary: 'test update',
 *          authToken: token
 *      });
 */
export default async function getToken(username: string, password: string, config?: GetTokenConfig): Promise<Token> {
    // checking the config
    const server = config?.server ?? 'https://www.wikidata.org';

    // checking if we have enough information to survive in the hostile environment of the browser
    // @ts-expect-error - we are checking if it exist and not using it if it doesn't
    const inBrowser = typeof window !== 'undefined';

    if (inBrowser && config?.origin === undefined) {
        // eslint-disable-next-line no-console
        console.warn('getToken: You are using this function in a browser environment without specifying the origin. This may lead to problems with cors.');
    }

    if (inBrowser && server.includes('wikidata')) {
        throw new Error('getToken: You are using this function in a browser environment. Wikidata does not allow cors requests from other domains.');
    }

    // checking the username and password
    if (username === undefined || password === undefined || username === '' || password === '' || username === null || password === null) {
        throw new Error('username and password are required');
    }

    // axios instance
    // we need to have the ability to pass in a custom axios instance for cors circumvention
    // so by default we use the axios instance from the axios package
    // the only thing needed for this is that the axios instance has the same api as the axios package
    const axiosInstance: AxiosInstance = config?.axiosInstance ?? axios;

    // Getting a edit token happens in three steps:
    // 1. Get a login token and cookie
    // 2. Use this token to login
    // 3. Use the cookie you get from logging in to get a edit token
    // Then use the token and cookie together in all future api calls

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
        throw new Error(`getting login token ${cookieResult.data.login.result}: ${cookieResult.data.login.reason}`);
    }

    const { token: loginToken } = cookieResult.data.login;
    const cookies = cookieResult.headers['set-cookie'];

    if (cookies === undefined) {
        throw new Error('cannot login: no cookies received');
    }

    // logging in
    const loginHeaders = {
        Cookie: cookies.join('; ')
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
        throw new Error(`logging in ${loginResult.data.login.result}: ${loginResult.data.login.reason}`);
    }

    // getting the token
    const tokenCookies = loginResult.headers['set-cookie']?.join('; ') ?? '';
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
