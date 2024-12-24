import { WikibaseItemSnak as WikidataWikibaseItemSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString, QString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the WikibaseItemSnak.
 *
 * Most used property of this type is P2860 (cites work).
 *
 * @class
 */
export default class WikibaseItemSnak extends Snak {
    private _numericID: number | undefined;

    datatype = 'wikibase-item';

    /**
     * @param {WikidataWikibaseItemSnak} snak The snak for this class in JSON format.
     * @example
     *     const snak = new WikibaseItemSnak(snak);
     */
    constructor(snak: WikidataWikibaseItemSnak) {
        super(snak);

        this._numericID = snak.datavalue?.value['numeric-id'];
    }

    /**
     * @alias id
     * @returns {string | undefined} The value of the snak.
     */
    public get id(): string | undefined {
        return this.hasValue ? `Q${this._numericID}` : undefined;
    }

    /**
     * @alias id
     * @param {string | undefined} value The value of the snak.
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
     * @returns {number | undefined} The value of the snak.
     */
    public get numericID(): number | undefined {
        return this._numericID;
    }

    /**
     * @alias numericID
     * @param {number | undefined} value The value of the snak.
     */
    public set numericID(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._numericID = value;
    }

    /**
     *
     * @returns {WikidataWikibaseItemSnak} The snak as JSON.
     * @example
     *      const json = itemSnak.toJSON();
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
     * This function checks if two snaks are equal.
     *
     * @param {WikibaseItemSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: WikibaseItemSnak): boolean {
        return this._numericID === other._numericID && this.property === other.property;
    }

    /**
     * Create a snak from some basic data.
     *
     * @static
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {QString} id The Wikibase item id in the `Q-form`.
     * @returns {WikibaseItemSnak} A snak with the given properties.
     * @example
     *    const snak = WikibaseItemSnak.fromID('P2860', 'Q42');
     */
    static fromID(property: PString, id: QString): WikibaseItemSnak {
        return new WikibaseItemSnak({
            snaktype: 'value',
            property,
            datatype: 'wikibase-item',
            datavalue: {
                value: {
                    'entity-type': 'item',
                    'numeric-id': Number.parseInt(id.slice(1), 10),
                    id
                },
                type: 'wikibase-entityid'
            }
        });
    }
}
