import {Snaks as WikidataSnaks, SnakType as WikidataSnakType} from '@wmde/wikibase-datamodel-types';

export default abstract class Snak {
    snaktype: WikidataSnakType;

    property: string;

    hash: string | undefined

    constructor(snak: WikidataSnaks) {
        this.snaktype = snak.snaktype;
        this.property = snak.property;

        this.hash = snak.hash;
    }

    public get hasValue() : boolean {
        return this.snaktype === 'value';
    }

    abstract toJSON(): WikidataSnaks
}
