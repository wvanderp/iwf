import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
import properties from 'wikidata-properties';

import normalizeOutput from './utils/normalizeOutput';
import arrayEqual from './utils/arrayEqual';

/**
 * The class for a sitelink.
 *
 * @class
 */
export default class SiteLink {
    site: string;

    title: string;

    badges: string[];

    _url: string | undefined;

    /**
     * @param {WikidataSiteLink} siteLink The siteLink for this class.
     * @example
     *   const siteLink = new SiteLink({
     *       site: 'enwiki',
     *       title: 'Berlin',
     *       badges: ['Q17437796'],
     *       url: 'https://en.wikipedia.org/wiki/Berlin'
     *   });
     */
    constructor(siteLink: WikidataSiteLink) {
        this.site = siteLink.site;
        this.title = siteLink.title;
        this._url = siteLink.url;
        this.badges = siteLink.badges ?? [];
    }

    /**
     * If the private property _url is set, then we know the URL already exists.
     * Otherwise, we look it up with the wikidata-properties package.
     *
     * @returns {string} The URL of the site link.
     */
    get url(): string {
        if (this._url !== undefined) return this._url;

        const url = properties.siteDetails[this.site]
            .pageUrl
            .replace('$1', this.title);

        return `https:${url}`;
    }

    /**
     * Create a unique ID for the site link.
     *
     * @returns {string} The ID.
     */
    public get internalID(): string {
        return `${this.site}:${this.title}`;
    }

    /**
     * This function checks if SiteLinks are equal.
     *
     * @param {SiteLink} other The other SiteLink.
     * @returns {boolean} True if the SiteLinks are equal.
     * @example
     *     const siteLink1 = new SiteLink({ site: 'enwiki', title: 'foo' });
     *     const siteLink2 = new SiteLink({ site: 'enwiki', title: 'bar' });
     *
     *     siteLink1.equals(siteLink2); // false
     */
    equals(other: SiteLink): boolean {
        return (
            this.site === other.site
            && this.title === other.title
            && arrayEqual(this.badges, other.badges)
            && this.url === other.url
        );
    }

    /**
     * @returns {WikidataSiteLink} The SiteLink in a JSON format.
     * @example
     *      const json = siteLink.toJSON();
     */
    toJSON(): WikidataSiteLink {
        return normalizeOutput({
            site: this.site,
            title: this.title,
            badges: this.badges,
            url: this._url
        });
    }

    /**
     * Create a SiteLink from a language and a value.
     *
     * @param {string} site To what wiki is the site link.
     * @param {string} title The title of the page.
     * @param {string[]} [badges] The badges of the site link, like featured article.
     * @param {string} [url] The URL of the page with domain.
     * @returns {SiteLink} The SiteLink object.
     * @example
     *  const siteLink = SiteLink.fromString('enwiki', 'Berlin');
     *
     *  // or
     *
     *  const siteLink = SiteLink.fromString('enwiki', 'Berlin', ['Q17437796']);
     *
     *  // or
     *
     *  const siteLink = SiteLink.fromString(
     *      'enwiki',
     *      'Berlin',
     *      ['Q17437796'],
     *      'https://en.wikipedia.org/wiki/Berlin'
     *  );
     */
    static fromString(site: string, title: string, badges?: string[], url?: string): SiteLink {
        return new SiteLink({
            site,
            title,
            badges,
            url
        });
    }
}
