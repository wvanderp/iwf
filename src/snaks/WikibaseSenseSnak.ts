import { WikibaseSenseSnak as WikidataWikibaseSenseSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the WikibaseSenseSnak
 *
 * Most used property of this type...
 *
 * @class
 */
export default class WikibaseSenseSnak extends Snak {
    private _lexemeId: number | undefined;

    private _senseId: number | undefined;

    datatype = 'wikibase-sense';

    /**
     * @param {WikidataWikibaseSenseSnak} snak the snak for this class in json format
     * @example
     *  const snak = new WikibaseSenseSnak(json);
     */
    constructor(snak: WikidataWikibaseSenseSnak) {
        super(snak);

        // example: L123-S456 -> lexemeId = 123, senseId = 456
        this._lexemeId = Number.parseInt(snak.datavalue?.value.id.split('-')[0].slice(1) ?? '', 10) || undefined;
        this._senseId = Number.parseInt(snak.datavalue?.value.id.split('-')[1].slice(1) ?? '', 10) || undefined;
    }

    /**
     * the lexeme id will take the form L{number}-S{number}
     *
     * @alias id
     * @returns {string | undefined} the value of the snak
     */
    public get id(): string | undefined {
        return this.hasValue ? `L${this._lexemeId}-S${this._senseId}` : undefined;
    }

    /**
     * @alias id
     * @param {string | undefined} value the value of the snak
     */
    public set id(value: string | undefined) {
        if (value === undefined) {
            this._lexemeId = undefined;
            this._senseId = undefined;
            this.snaktype = 'novalue';
            return;
        }

        this._lexemeId = Number.parseInt(value.split('-')[0].slice(1), 10);
        this._senseId = Number.parseInt(value.split('-')[1].slice(1), 10);
    }

    /**
     * @alias lexemeId
     * @returns {number | undefined} the value of the snak
     */
    public get lexemeId(): number | undefined {
        return this._lexemeId;
    }

    /**
     * @alias lexemeId
     * @param {number | undefined} value the value of the snak
     */
    public set lexemeId(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._lexemeId = value;
    }

    /**
     * @alias senseId
     * @returns {number | undefined} the value of the snak
     */
    public get senseId(): number | undefined {
        return this._senseId;
    }

    /**
     * @alias senseId
     * @param {number | undefined} value the value of the snak
     */
    public set senseId(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._senseId = value;
    }

    /**
     *
     * @returns {WikidataWikibaseSenseSnak} the snak as json
     * @example
     *      const json = WikibaseSenseSnak.toJson();
     */
    toJSON(): WikidataWikibaseSenseSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    id: `L${this._lexemeId}-S${this._senseId}`,
                    'entity-type': 'sense'
                },
                type: 'wikibase-entityid'
            } : undefined,
            datatype: this.datatype
        }) as WikidataWikibaseSenseSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {WikibaseSenseSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: WikibaseSenseSnak): boolean {
        return this._lexemeId === other._lexemeId
            && this._senseId === other._senseId
            && this.property === other.property;
    }

    /**
     * Create a new instance of the class from some basic data
     *
     * @param {PString} property the property of the snak
     * @param {number} id the lexeme id
     * @returns {WikibaseSenseSnak} a new instance of the class
     * @example
     *    const snak = WikibaseSenseSnak.fromData('P123', 123, 456);
     */
    static fromData(property: PString, id: string): WikibaseSenseSnak {
        return new WikibaseSenseSnak({
            snaktype: 'value',
            property,
            datatype: 'wikibase-sense',
            datavalue: {
                value: {
                    id,
                    'entity-type': 'sense'
                },
                type: 'wikibase-entityid'
            }
        });
    }
}
