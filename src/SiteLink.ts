import {SiteLink as WikidataSiteLink} from '@wmde/wikibase-datamodel-types';
import {siteDetails} from 'wikidata-properties';

import normalizeOutput from './utils/normalizeOutput';

/**
 * the class for a sitelink
 *
 * @class
 */
export default class SiteLink {
    site: string;

    title: string;

    badges: string[];

    _url: string | undefined;

    constructor(siteLink: WikidataSiteLink) {
        this.site = siteLink.site;
        this.title = siteLink.title;
        this._url = siteLink.url;
        this.badges = siteLink.badges ?? [];
    }

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
