import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
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
    constructor(siteLink: WikidataSiteLink);
    get url(): string;
    /**
     * @returns {WikidataSiteLink} the SiteLink in a json format
     */
    toJSON(): WikidataSiteLink;
}
//# sourceMappingURL=SiteLink.d.ts.map