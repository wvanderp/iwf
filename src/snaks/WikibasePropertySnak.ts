import {WikibasePropertySnak as WikidataWikibasePropertySnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class WikibasePropertySnak extends Snak {
    private _numericID: number | undefined

    datatype = 'wikibase-property';

    constructor(snak: WikidataWikibasePropertySnak) {
        super(snak);

        this._numericID = snak.datavalue?.value['numeric-id'];
    }

    public get id() : string| undefined {
        return this.hasValue ? `P${this._numericID}` : undefined;
    }

    public set id(value: string | undefined) {
        if (value === undefined) {
            this._numericID = undefined;
            this.snaktype = 'novalue';
            return;
        }

        this._numericID = Number.parseInt(value.slice(1), 10);
    }

    public get numericID() : number | undefined {
        return this._numericID;
    }

    public set numericID(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._numericID = value;
    }

    toJSON(): WikidataWikibasePropertySnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            datavalue: {
                value: {
                    'entity-type': 'property' as const,
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid' as const
            },
            datatype: this.datatype
        }) as WikidataWikibasePropertySnak;
    }
}
