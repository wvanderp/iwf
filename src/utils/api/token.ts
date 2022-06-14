import axios from 'axios';
import qs from 'qs';
import { ActionLoginResponse, QueryMetaTokenResponse } from '../../types/apiResponse';

const loginUrl = 'https://www.wikidata.org/w/api.php?action=login&format=json';
const tokenUrl = 'https://www.wikidata.org/w/api.php?action=query&meta=tokens&type=csrf&format=json';

export interface Token {
    token: string;
    cookie: string;
}

/**
 * use this function to retrieve tokens by using a username and password.
 *
 * @param {string} username the username of the user
 * @param {string} password the password of the user
 * @returns {Token} a object containing the token and the cookie
 * @example
 *      const token = await getToken('your wikidata username', 'your wikidata password');
 *      upload(item, {
 *          summary: 'test update',
 *          authToken: token
 *      });
 */
export default async function getToken(username: string, password: string): Promise<Token> {
    // getting a edit token happens in three steps:
    // 1. get a login token and cookie
    // 2. use this token to login
    // 3. use the cookie you get from logging in to get a edit token
    // then use the token and cookie together in all future api calls

    // getting the login cookie & token
    const body = qs.stringify({ username, password });

    const cookieResult = await axios.post<ActionLoginResponse>(loginUrl, body);

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

    const loginResult = await axios.post(
        loginUrl,
        loginBody,
        { headers: loginHeaders }
    );

    if (loginResult.data.login.result !== 'Success') {
        throw new Error('error logging in');
    }

    // getting the token
    const tokenCookies = loginResult.headers['set-cookie']?.join('; ') ?? '';
    const tokenResult = await axios.get<QueryMetaTokenResponse>(tokenUrl, { headers: { Cookie: tokenCookies } });

    return {
        token: tokenResult.data.query.tokens.csrftoken,
        cookie: tokenCookies
    };
}
