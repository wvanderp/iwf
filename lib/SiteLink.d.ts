import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
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
    constructor(siteLink: WikidataSiteLink);
    /**
     * if the private property _url is set then we know the url already exists
     * else we look it up with wikidata-properties package
     *
     * @returns {string} the url of the site link
     */
    get url(): string;
    /**
     * @returns {WikidataSiteLink} the SiteLink in a json format
     */
    toJSON(): WikidataSiteLink;
}
//# sourceMappingURL=SiteLink.d.ts.map