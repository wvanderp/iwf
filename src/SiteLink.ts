import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
import properties from 'wikidata-properties';
import { v4 as uuidv4 } from 'uuid';

import normalizeOutput from './utils/normalizeOutput';
import arrayEqual from './utils/arrayEqual';

/**
 * the class for a site link
 *
 * @class
 */
export default class SiteLink {
    /** A ID for using things that don't have an ID */
    internalID: string;

    site: string;

    title: string;

    badges: string[];

    _url: string | undefined;

    /**
     * @param {WikidataSiteLink} siteLink The siteLink for this class
     * @example
     */
    constructor(siteLink: WikidataSiteLink) {
        this.site = siteLink.site;
        this.title = siteLink.title;
        this._url = siteLink.url;
        this.badges = siteLink.badges ?? [];
        this.internalID = uuidv4();
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
     * this function checks if SiteLinks are equal
     *
     * @param {SiteLink} other the other SiteLink
     * @returns {boolean} true if the SiteLink are equal
     * @example
     */
    equals(other: SiteLink): boolean {
        return (
            this.site === other.site
            && this.title === other.title
            && arrayEqual(this.badges, other.badges)
        );
    }

    /**
     * @returns {WikidataSiteLink} the SiteLink in a json format
     * @example
     */
    toJSON(): WikidataSiteLink {
        return normalizeOutput({
            site: this.site,
            title: this.title,
            badges: this.badges,
            url: this._url
        });
    }
}
