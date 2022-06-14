import { WikibasePropertySnak as WikidataWikibasePropertySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the wikibase property snak
 *
 * most used property of this type P1659 (see also)
 *
 * @class
 */
export default class WikibasePropertySnak extends Snak {
    /** the numeric id of the property */
    private _numericID: number | undefined;

    datatype = 'wikibase-property';

    /**
     * @param {WikidataWikibasePropertySnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataWikibasePropertySnak) {
        super(snak);

        this._numericID = snak.datavalue?.value['numeric-id'];
    }

    /**
     * returns the ID of the property with the P
     *
     * @returns {string | undefined} the ID of the property with the P
     */
    public get id(): string | undefined {
        return this.hasValue ? `P${this._numericID}` : undefined;
    }

    /**
     * This function parses the string by slicing the first char and then number.parseInt
     * if value is undefined it also sets the snaktype to 'novalue
     *
     * @property {string | undefined} value the value that you want to set
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
     * returns the numeric part of the property
     *
     * @returns {number | undefined} the numeric ID of the property
     */
    public get numericID(): number | undefined {
        return this._numericID;
    }

    /**
     * if value is undefined it also sets the snaktype to 'novalue
     *
     * @property {number | undefined} value the numeric id to be set in the snak
     */
    public set numericID(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._numericID = value;
    }

    /**
     * @param {boolean} isMediainfo where to output for the mediainfo type, this changes some of the json output
     * @returns {WikidataWikibasePropertySnak} the snak as json
     * @example
     */
    toJSON(isMediainfo = false): WikidataWikibasePropertySnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: {
                value: {
                    'entity-type': 'property' as const,
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid' as const
            },
            datatype: isMediainfo ? undefined : this.datatype
        }) as WikidataWikibasePropertySnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {WikibasePropertySnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: WikibasePropertySnak): boolean {
        return this._numericID === other._numericID;
    }
}
