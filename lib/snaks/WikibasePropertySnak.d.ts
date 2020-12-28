import { WikibasePropertySnak as WikidataWikibasePropertySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class WikibasePropertySnak extends Snak {
    numericID: number | undefined;
    constructor(snak: WikidataWikibasePropertySnak);
    get id(): string | undefined;
    toJSON(): WikidataWikibasePropertySnak;
}
//# sourceMappingURL=WikibasePropertySnak.d.ts.map