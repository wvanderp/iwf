import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from '@wmde/wikibase-datamodel-types';
export default abstract class Snak {
    snaktype: WikidataSnakType;
    property: string;
    hash: string | undefined;
    abstract datatype: string;
    constructor(snak: WikidataSnaks);
    get hasValue(): boolean;
    abstract toJSON(): WikidataSnaks;
}
//# sourceMappingURL=Snak.d.ts.map