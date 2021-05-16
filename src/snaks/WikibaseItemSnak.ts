import {WikibaseItemSnak as WikidataWikibaseItemSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the WikibaseItemSnak
 *
 * most used property of this type P2860 (cites work)
 *
 * @class
 */
export default class WikibaseItemSnak extends Snak {
    private _numericID: number | undefined

    datatype = 'wikibase-item';

    /**
     * @param {WikidataWikibaseItemSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataWikibaseItemSnak) {
        super(snak);

        this._numericID = snak.datavalue?.value['numeric-id'];
    }

    /**
     * @alias id
     * @returns {string | undefined} the value of the snak
     */
    public get id() : string| undefined {
        return this.hasValue ? `Q${this._numericID}` : undefined;
    }

    /**
     * @alias id
     * @param {string | undefined} value the value of the snak
     */
    public set id(value: string | undefined) {
        if (value === undefined) {
            this._numericID = undefined;
            this.snaktype = 'novalue';
            return;
        }

        this._numericID = Number.parseInt(value.slice(1), 10);
    }

    /**
     * @alias numericID
     * @returns {number | undefined} the value of the snak
     */
    public get numericID() : number | undefined {
        return this._numericID;
    }

    /**
     * @alias numericID
     * @param {number | undefined} value the value of the snak
     */
    public set numericID(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._numericID = value;
    }

    /**
     *
     * @returns {WikidataWikibaseItemSnak} the snak as json
     */
    toJSON(): WikidataWikibaseItemSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    'entity-type': 'item' as const,
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid' as const
            } : undefined,
            datatype: this.datatype
        }) as WikidataWikibaseItemSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {WikibaseItemSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: WikibaseItemSnak): boolean {
        return this._numericID === other._numericID;
    }
}
