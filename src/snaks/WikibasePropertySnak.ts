import { WikibasePropertySnak as WikidataWikibasePropertySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the WikibasePropertySnak.
 *
 * Most used property of this type P1659 (see also).
 *
 * @class
 */
export default class WikibasePropertySnak extends Snak {
    /** The numeric ID of the property */
    private _numericID: number | undefined;

    datatype = 'wikibase-property';

    /**
     * @param {WikidataWikibasePropertySnak} snak The snak for this class in JSON format.
     * @example
     *   const snak = new WikibasePropertySnak(snak);
     */
    constructor(snak: WikidataWikibasePropertySnak) {
        super(snak);

        this._numericID = snak.datavalue?.value['numeric-id'];
    }

    /**
     * Returns the ID of the property with the P.
     *
     * @returns {PString | undefined} The ID of the property with the P.
     */
    public get id(): PString | undefined {
        return this.hasValue && this._numericID ? `P${this._numericID}` : undefined;
    }

    /**
     * This function parses the string by slicing the first char and then Number.parseInt.
     * If value is undefined, it also sets the snaktype to 'novalue'.
     *
     * @property {PString | undefined} value The value that you want to set.
     */
    public set id(value: PString | undefined) {
        if (value === undefined) {
            this._numericID = undefined;
            this.snaktype = 'novalue';
            return;
        }

        this._numericID = Number.parseInt(value.slice(1), 10);
    }

    /**
     * Returns the numeric part of the property.
     *
     * @returns {number | undefined} The numeric ID of the property.
     */
    public get numericID(): number | undefined {
        return this._numericID;
    }

    /**
     * If value is undefined, it also sets the snaktype to 'novalue'.
     *
     * @property {number | undefined} value The numeric ID to be set in the snak.
     */
    public set numericID(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._numericID = value;
    }

    /**
     *
     * @returns {WikidataWikibasePropertySnak} The snak as JSON.
     * @example
     *      const json = propertySnak.toJson();
     */
    toJSON(): WikidataWikibasePropertySnak {
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
            datatype: this.datatype
        }) as WikidataWikibasePropertySnak;
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param {WikibasePropertySnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: WikibasePropertySnak): boolean {
        return this._numericID === other._numericID && this.property === other.property;
    }
}
