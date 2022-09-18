import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
import properties from 'wikidata-properties';

import normalizeOutput from './utils/normalizeOutput';
import arrayEqual from './utils/arrayEqual';

/**
 * the class for a site link
 *
 * @class
 */
export default class SiteLink {
    site: string;

    title: string;

    badges: string[];

    _url: string | undefined;

    /**
     * @param {WikidataSiteLink} siteLink The siteLink for this class
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
     * if the private property _url is set then we know the url already exists
     * else we look it up with wikidata-properties package
     *
     * @returns {string} the url of the site link
     */
    get url(): string {
        if (this._url !== undefined) return this._url;

        const url = properties.siteDetails[this.site]
            .pageUrl
            .replace('$1', this.title);

        return `https:${url}`;
    }

    /**
     * create a unique id for the site link
     *
     * @returns {string} the id
     */
    public get internalID(): string {
        return `${this.site}:${this.title}`;
    }

    /**
     * this function checks if SiteLinks are equal
     *
     * @param {SiteLink} other the other SiteLink
     * @returns {boolean} true if the SiteLink are equal
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
     * @returns {WikidataSiteLink} the SiteLink in a json format
     * @example
     *      const json = siteLink.toJson();
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
     * create a SiteLink from a language and a value
     *
     * @param {string} site to what wiki is the site link
     * @param {string} title the title of the page
     * @param {[string[]]} badges the badges of the site link like featured article
     * @param {[string]} url the url of the page with domain
     * @returns {SiteLink} the SiteLink object
     * @example
     *  const SiteLink = SiteLink.fromString('enwiki', 'Berlin');
     *
     *  // or
     *
     *  const SiteLink = SiteLink.fromString('enwiki', 'Berlin', ['Q17437796']);
     *
     *  // or
     *
     *  const SiteLink = SiteLink.fromString(
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
