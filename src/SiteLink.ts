import {SiteLink as WikidataSiteLink} from '@wmde/wikibase-datamodel-types';
import {siteDetails} from 'wikidata-properties';
import { v4 as uuidv4 } from 'uuid';

import normalizeOutput from './utils/normalizeOutput';

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

        const url = siteDetails[this.site]
            .pageUrl
            .replace('$1', this.title);

        return `https:${url}`;
    }

    /**
     * @returns {WikidataSiteLink} the SiteLink in a json format
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
