import axios from 'axios';
import qs from 'qs';
import { ActionLoginResponse, QueryMetaTokenResponse } from '../../types/apiResponse';

/**
 * generates the login url for a given server
 *
 * Main-account login via \"action=login\" is deprecated and may stop working without warning.
 * https://phabricator.wikimedia.org/T137805
 *
 * @private
 * @param {string} server the server to generate the url for
 * @returns {string} the login url
 * @example
 *     const loginUrl = getLoginUrl('https://test.wikidata.org');
 *    // loginUrl = 'https://test.wikidata.org/w/api.php?action=login&format=json'
 */
export function loginUrl(server: string): string {
    const url = new URL(server);
    return `${url.origin}/w/api.php?action=login&format=json`;
}

/**
 * Generates the token url for a given server
 *
 * @private
 * @param {string} server the server to generate the url for
 * @returns {string} the token url
 * @example
 *    const tokenUrl = getTokenUrl('https://test.wikidata.org');
 *   // tokenUrl = 'https://test.wikidata.org/w/api.php?action=query&meta=tokens&type=csrf&format=json'
 */
export function tokenUrl(server: string): string {
    const url = new URL(server);
    return `${url.origin}/w/api.php?action=query&meta=tokens&type=csrf&format=json`;
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

/**
 * use this function to retrieve tokens by using a username and password.
 *
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 * @param {string} [server] The server to get the token from
 * @throws {Error} If the login was not successful
 * @returns {Token} A object containing the token and the cookie
 * @example
 *      const token = await getToken('your wikidata username', 'your wikidata password');
 *      upload(item, {
 *          summary: 'test update',
 *          authToken: token
 *      });
 */
export default async function getToken(username: string, password: string, server = 'https://www.wikidata.org'): Promise<Token> {
    // checking the username and password
    if (username === undefined || password === undefined || username === '' || password === '' || username === null || password === null) {
        throw new Error('username and password are required');
    }

    // Getting a edit token happens in three steps:
    // 1. Get a login token and cookie
    // 2. Use this token to login
    // 3. Use the cookie you get from logging in to get a edit token
    // Then use the token and cookie together in all future api calls

    // Getting the login cookie & token
    const body = qs.stringify({ username, password });

    const cookieResult = await axios.post<ActionLoginResponse>(loginUrl(server), body);

    const { token: loginToken } = cookieResult.data.login;
    const cookies = cookieResult.headers['set-cookie'];

    if (cookies === undefined) {
        throw new Error('cannot login');
    }

    // logging in
    const loginHeaders = {
        Cookie: cookies.join('; ')
    };
    const loginBody = qs.stringify({ lgname: username, lgpassword: password, lgtoken: loginToken });

    const loginResult = await axios.post<LoginResponse>(
        loginUrl(server),
        loginBody,
        { headers: loginHeaders }
    );

    if (loginResult.data.login.result !== 'Success') {
        throw new Error(`logging in ${loginResult.data.login.result}: ${loginResult.data.login.reason}`);
    }

    // getting the token
    const tokenCookies = loginResult.headers['set-cookie']?.join('; ') ?? '';
    const tokenResult = await axios.get<QueryMetaTokenResponse>(
        tokenUrl(server),
        { headers: { Cookie: tokenCookies } }
    );

    return {
        token: tokenResult.data.query.tokens.csrftoken,
        cookie: tokenCookies
    };
}
