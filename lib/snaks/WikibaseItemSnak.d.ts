import { WikibaseItemSnak as WikidataWikibaseItemSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class WikibaseItemSnak extends Snak {
    numericID: number | undefined;
    constructor(snak: WikidataWikibaseItemSnak);
    get id(): string | undefined;
    toJSON(): WikidataWikibaseItemSnak;
}
//# sourceMappingURL=WikibaseItemSnak.d.ts.map