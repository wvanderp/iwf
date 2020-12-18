import {SiteLink as WikidataSiteLink} from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

export default class SideLink {
    site: string;

    title: string;

    badges: string[];

    url: string;

    constructor(siteLink: WikidataSiteLink) {
        this.site = siteLink.site;
        this.title = siteLink.title;
        this.url = siteLink.url;
        this.badges = siteLink.badges ?? [];
    }

    toJSON(): WikidataSiteLink {
        return normalizeOutput({
            site: this.site,
            title: this.title,
            badges: this.badges,
            url: this.url
        });
    }
}
