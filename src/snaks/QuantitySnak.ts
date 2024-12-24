import { QuantitySnak as WikidataQuantitySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString, QString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * This function mainly exists because Wikidata has the weird habit of indicating positive numbers with the plus sign (+).
 *
 * @private
 * @param {number} amount The number that should be formatted.
 * @returns {string} The formatted number as a string.
 */
function formatNumberFromNumber(amount: number): string {
    if (amount >= (0)) {
        return `+${amount}`;
    }
    return `${amount}`;
}

/**
 * This function also mainly exists because Wikidata has the weird habit of indicating positive numbers with the plus sign (+),
 * but this one works on strings.
 *
 * @private
 * @param {string | undefined} amount The number that should be formatted.
 * @returns {string} The formatted number as a string.
 */
function formatNumberFromString(amount: string | undefined): string {
    if (!amount) throw new Error('amount is undefined');

    if (amount.startsWith('+') || amount.startsWith('-')) {
        return amount;
    }
    return `+${amount}`;
}

const dataType = 'quantity';

/**
 * Class for the QuantitySnak.
 *
 * Most used property of this type is P1215 (apparent magnitude).
 *
 * @class
 */
export default class QuantitySnak extends Snak {
    private _amount: string | undefined = undefined;

    private _upperBound: string | undefined = undefined;

    private _lowerBound: string | undefined = undefined;

    unit: string;

    datatype = dataType;

    /**
     * @param {WikidataQuantitySnak} snak The snak for this class in JSON format.
     * @throws {Error} If the upperBound is smaller than the amount or the lowerBound is bigger than the amount.
     * @example
     *     const snak = new QuantitySnak(json);
     */
    constructor(snak: WikidataQuantitySnak) {
        super(snak);

        if (
            snak.datavalue?.value.lowerBound
            && Number.parseInt(snak.datavalue?.value.lowerBound, 10) > Number.parseInt(snak.datavalue?.value.amount, 10)
        ) {
            throw new Error('lowerBound is bigger than amount');
        }

        if (
            snak.datavalue?.value.upperBound
            && Number.parseInt(snak.datavalue?.value.upperBound, 10) < Number.parseInt(snak.datavalue?.value.amount, 10)
        ) {
            throw new Error('upperBound is smaller than amount');
        }

        const amount = snak.datavalue?.value.amount;
        const upperBound = snak.datavalue?.value.upperBound;
        const lowerBound = snak.datavalue?.value.lowerBound;

        this._amount = amount ? formatNumberFromString(amount) : undefined;
        this._upperBound = upperBound ? formatNumberFromString(upperBound) : undefined;
        this._lowerBound = lowerBound ? formatNumberFromString(lowerBound) : undefined;

        if (!snak.datavalue?.value.unit) {
            throw new Error('unit is not defined');
        }

        this.unit = snak.datavalue?.value.unit;
    }

    /**
     * @returns {number | undefined} The amount of the quantity.
     */
    get amount(): number | undefined {
        return this._amount ? Number(this._amount) : undefined;
    }

    /**
     * @param {number | undefined} number The number that the amount will be set to.
     */
    set amount(number: number | undefined) {
        if (number === undefined) {
            this._amount = undefined;
            return;
        }

        this._amount = formatNumberFromNumber(number);
    }

    /**
     * @returns {number | undefined} The upperBound of the quantity.
     */
    get upperBound(): number | undefined {
        return this._upperBound ? Number(this._upperBound) : undefined;
    }

    /**
     * @param {number | undefined} number The number that the upperBound will be set to.
     */
    set upperBound(number: number | undefined) {
        if (number === undefined) {
            this._upperBound = undefined;
            return;
        }

        this._upperBound = formatNumberFromNumber(number);
    }

    /**
     * @returns {number | undefined} The lowerBound of the quantity.
     */
    get lowerBound(): number | undefined {
        return this._lowerBound ? Number(this._lowerBound) : undefined;
    }

    /**
     * @param {number | undefined} number The number that the lowerBound will be set to.
     */
    set lowerBound(number: number | undefined) {
        if (number === undefined) {
            this._lowerBound = undefined;
            return;
        }

        this._lowerBound = formatNumberFromNumber(number);
    }

    /**
     * Returns the snak as JSON.
     *
     * @returns {WikidataQuantitySnak} The snak as JSON.
     * @example
     *      const json = quantitySnak.toJSON();
     */
    toJSON(): WikidataQuantitySnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    amount: formatNumberFromString(this._amount),
                    unit: this.unit,
                    upperBound: this._upperBound ? formatNumberFromString(this._upperBound) : undefined,
                    lowerBound: this._lowerBound ? formatNumberFromString(this._lowerBound) : undefined,
                },
                type: 'quantity' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param {QuantitySnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: QuantitySnak): boolean {
        return this._amount === other._amount
            && this._upperBound === other._upperBound
            && this._lowerBound === other._lowerBound
            && this.unit === other.unit
            && this.property === other.property;
    }

    /**
     * Create a snak from some basic data.
     *
     * @static
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {number} quantity Amount of the quantity.
     * @param {number} [lowerBound] LowerBound of the quantity.
     * @param {number} [upperBound] UpperBound of the quantity.
     * @param {QString} [unit] Unit of the quantity.
     * @returns {QuantitySnak} A snak with the given properties.
     * @example
     *     const snak = QuantitySnak.fromNumbers('P1215', 1);
     */
    static fromNumbers(
        property: PString,
        quantity: number,
        lowerBound?: number | null,
        upperBound?: number | null,
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
