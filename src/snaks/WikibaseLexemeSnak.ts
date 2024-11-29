import { WikiBaseLexemeSnak as WikidataWikiBaseLexemeSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { LString, PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the WikibaseLexeme
 *
 * Most used property of this type ...
 *
 * @class
 */
export default class WikibaseLexemeSnak extends Snak {
    _numericID: number | undefined;

    datatype = 'wikibase-lexeme';

    /**
     * @param {WikidataWikiBaseLexemeSnak} snak the snak for this class in json format
     * @example
     *  const snak = new WikibaseLexemeSnak(json);
     */
    constructor(snak: WikidataWikiBaseLexemeSnak) {
        super(snak);

        this._numericID = snak.datavalue?.value['numeric-id'];
    }

    /**
     * the lexeme id will be prefixed with L
     *
     * @alias id
     * @returns {string | undefined} the value of the snak
     */
    public get id(): string | undefined {
        return this.hasValue ? `L${this._numericID}` : undefined;
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
    public get numericID(): number | undefined {
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
     * @returns {WikidataWikiBaseLexemeSnak} the snak as json
     * @example
     *      const json = WikibaseLexemeSnak.toJson();
     */
    toJSON(): WikidataWikiBaseLexemeSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    'entity-type': 'lexeme',
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid'
            } : undefined,
            datatype: this.datatype
        }) as WikidataWikiBaseLexemeSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {WikibaseLexemeSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *    if (WikibaseLexemeSnak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: WikibaseLexemeSnak): boolean {
        return this._numericID === other._numericID && this.property === other.property;
    }

    /**
     * Create a new instance of the class from some basic data
     *
     * @static
     * @param {PString} property the property of the snak in 'P-form'
     * @param {LString} id the id of the lexeme in 'L-form'
     * @returns {WikibaseLexemeSnak} a new instance of the class
     * @example
     *      const snak = WikibaseLexemeSnak.fromData('P1', 'L1');
     */
    static fromData(property: PString, id: LString): WikibaseLexemeSnak {
        return new WikibaseLexemeSnak({
            snaktype: 'value',
            property,
            datatype: 'wikibase-lexeme',
            datavalue: {
                value: {
                    'entity-type': 'lexeme',
                    'numeric-id': Number.parseInt(id.slice(1), 10),
                    id
                },
                type: 'wikibase-entityid'
            }
        });
    }
}
