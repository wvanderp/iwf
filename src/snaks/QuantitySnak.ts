import { QuantitySnak as WikidataQuantitySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString, QString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * this function mainly exist because wikidata has the weird habit of indicating positive numbers with the plus sign (+)
 *
 * @private
 * @param {number} amount the number that should be formatted
 * @returns {string} the formatted number as a string
 */
function formatNumber(amount: number): string {
    if (amount >= (0)) {
        return `+${amount}`;
    }
    return `${amount}`;
}

/**
 * class for the QuantitySnak
 *
 * most used property of this type P1215 (apparent magnitude)
 *
 * @class
 */
export default class QuantitySnak extends Snak {
    private _amount: string | undefined = undefined;

    private _upperBound: string | undefined = undefined;

    private _lowerBound: string | undefined = undefined;

    unit: string | undefined;

    datatype = 'quantity';

    /**
     * @param {WikidataQuantitySnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataQuantitySnak) {
        super(snak);

        const amount = snak.datavalue?.value.amount;
        const upperBound = snak.datavalue?.value.upperBound;
        const lowerBound = snak.datavalue?.value.lowerBound;

        this._amount = amount;
        this._upperBound = upperBound;
        this._lowerBound = lowerBound;

        this.unit = snak.datavalue?.value.unit;
    }

    /**
     * @returns {number | undefined} the amount of the quantity
     */
    get amount(): number | undefined {
        return this._amount ? Number(this._amount) : undefined;
    }

    /**
     * @param {number | undefined} number the number that the amount will be set to
     */
    set amount(number: number | undefined) {
        if (number === undefined) {
            this._amount = undefined;
            return;
        }

        this._amount = formatNumber(number);
    }

    /**
     * @returns {number | undefined} the upperBound of the quantity
     */
    get upperBound(): number | undefined {
        return this._upperBound ? Number(this._upperBound) : undefined;
    }

    /**
     * @param {number | undefined} number the number that the upperBound will be set to
     */
    set upperBound(number: number | undefined) {
        if (number === undefined) {
            this._upperBound = undefined;
            return;
        }

        this._upperBound = formatNumber(number);
    }

    /**
     * @returns {number | undefined} the lowerBound of the quantity
     */
    get lowerBound(): number | undefined {
        return this._lowerBound ? Number(this._lowerBound) : undefined;
    }

    /**
     * @param {number | undefined} number the number that the lowerBound will be set to
     */
    set lowerBound(number: number | undefined) {
        if (number === undefined) {
            this._lowerBound = undefined;
            return;
        }

        this._lowerBound = formatNumber(number);
    }

    /**
     *
     * @returns {WikidataQuantitySnak} the snak as json
     * @example
     *      const json = quantitySnak.toJson();
     */
    toJSON(): WikidataQuantitySnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    amount: this._amount,
                    unit: this.unit,
                    upperBound: this._upperBound,
                    lowerBound: this._lowerBound
                },
                type: 'quantity'
            } : undefined,
            datatype: this.datatype
        }) as WikidataQuantitySnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {QuantitySnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: QuantitySnak): boolean {
        return this._amount === other._amount
            && this._upperBound === other._upperBound
            && this._lowerBound === other._lowerBound
            && this.unit === other.unit;
    }

    /**
     * create a snak from some basic data
     *
     * @static
     * @param {PString} property the property of the snak in 'P-form'
     * @param {number} quantity amount of the quantity
     * @param {number} [upperBound] upperBound of the quantity
     * @param {number} [lowerBound] lowerBound of the quantity
     * @param {QString} [unit] unit of the quantity
     * @returns {QuantitySnak} a snak with the given properties
     * @example
     *     const snak = QuantitySnak.fromNumbers('P1215', 1);
     */
    static fromNumbers(
        property: PString,
        quantity: number,
        upperBound?: number,
        lowerBound?: number,
        unit?: QString
    ): QuantitySnak {
        return new QuantitySnak({
            snaktype: 'value',
            property,
            datavalue: {
                value: {
                    amount: quantity.toString(),
                    unit: unit ? `http://www.wikidata.org/entity/${unit}` : '1',
                    upperBound: upperBound ? upperBound.toString() : undefined,
                    lowerBound: lowerBound ? lowerBound.toString() : undefined
                },
                type: 'quantity'
            },
            datatype: 'quantity'
        });
    }
}
