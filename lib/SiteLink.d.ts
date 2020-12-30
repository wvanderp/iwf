import { SiteLink as WikidataSiteLink } from '@wmde/wikibase-datamodel-types';
export default class SiteLink {
    site: string;
    title: string;
    badges: string[];
    _url: string | undefined;
    constructor(siteLink: WikidataSiteLink);
    get url(): string;
    toJSON(): WikidataSiteLink;
}
//# sourceMappingURL=SiteLink.d.ts.map