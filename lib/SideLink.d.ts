import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
export default class SideLink {
    site: string;
    title: string;
    badges: string[];
    url: string;
    constructor(siteLink: WikidataSiteLink);
    toJSON(): WikidataSiteLink;
}
//# sourceMappingURL=SideLink.d.ts.map