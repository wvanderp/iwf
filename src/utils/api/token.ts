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
 * @deprecated Use BotPasswordAuth instead for authentication.
 *
 * @typedef {object} Token
 * @property {string} token The token
 * @property {string} cookie The cookie
 */
export interface Token {
    token: string;
    cookie: string;
}
