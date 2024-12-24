/**
 * @private
 * @param {string} server The domain for the Wikibase instance.
 * @param {string} [origin] The origin to use for the API calls, also known as the "domain" of the web app (only needed for CORS).
 * @returns {void}
 */
export default function corsCheck(server: string, origin?: string): void {
    // Checking if we have enough information to survive in the hostile environment of the browser.
    // @ts-expect-error - We are checking if it exists and not using it if it doesn't.
    const inBrowser = typeof window !== 'undefined';

    if (inBrowser && origin === undefined) {
        // eslint-disable-next-line no-console
        console.warn('getToken: You are using this function in a browser environment without specifying the origin. This may lead to problems with CORS.');
    }

    if (inBrowser && server.includes('wikidata')) {
        // eslint-disable-next-line no-console
        console.warn('getToken: You are using this function in a browser environment. Wikidata does not allow CORS requests from other domains.');
    }
}
