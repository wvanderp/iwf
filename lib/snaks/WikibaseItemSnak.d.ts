import { WikibaseItemSnak as WikidataWikibaseItemSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class WikibaseItemSnak extends Snak {
    private _numericID;
    datatype: string;
    constructor(snak: WikidataWikibaseItemSnak);
    get id(): string | undefined;
    set id(value: string | undefined);
    get numericID(): number | undefined;
    set numericID(value: number | undefined);
    toJSON(): WikidataWikibaseItemSnak;
}
//# sourceMappingURL=WikibaseItemSnak.d.ts.map