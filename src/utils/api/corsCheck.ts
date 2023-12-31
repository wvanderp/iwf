/**
 * @private
 * @param {string} server the domain for the wikibase instance
 * @param {string} [origin] the origin to use for the api calls aka the "domain" of the webapp (only needed for cors)
 */
export default function corsCheck(server: string, origin?: string): void {
    // checking if we have enough information to survive in the hostile environment of the browser
    // @ts-expect-error - we are checking if it exist and not using it if it doesn't
    const inBrowser = typeof window !== 'undefined';

    if (inBrowser && origin === undefined) {
        // eslint-disable-next-line no-console
        console.warn('getToken: You are using this function in a browser environment without specifying the origin. This may lead to problems with cors.');
    }

    if (inBrowser && server.includes('wikidata')) {
        // eslint-disable-next-line no-console
        console.warn('getToken: You are using this function in a browser environment. Wikidata does not allow cors requests from other domains.');
    }
}
