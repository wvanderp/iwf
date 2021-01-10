import { WikibasePropertySnak as WikidataWikibasePropertySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class WikibasePropertySnak extends Snak {
    private _numericID;
    datatype: string;
    constructor(snak: WikidataWikibasePropertySnak);
    get id(): string | undefined;
    set id(value: string | undefined);
    get numericID(): number | undefined;
    set numericID(value: number | undefined);
    toJSON(): WikidataWikibasePropertySnak;
}
//# sourceMappingURL=WikibasePropertySnak.d.ts.map