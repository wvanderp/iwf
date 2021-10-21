import { QuantitySnak as WikidataQuantitySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
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
     * @returns {number} the amount of the quantity
     */
    get amount(): number {
        return Number(this._amount);
    }

    /**
     * @param {number} number the number that the amount will be set to
     */
    set amount(number: number) {
        this._amount = formatNumber(number);
    }

    /**
     * @returns {number} the upperBound of the quantity
     */
    get upperBound(): number {
        return Number(this._upperBound);
    }

    /**
     * @param {number} number the number that the upperBound will be set to
     */
    set upperBound(number: number) {
        this._upperBound = formatNumber(number);
    }

    /**
     * @returns {number} the lowerBound of the quantity
     */
    get lowerBound(): number {
        return Number(this._lowerBound);
    }

    /**
     * @param {number} number the number that the lowerBound will be set to
     */
    set lowerBound(number: number) {
        this._lowerBound = formatNumber(number);
    }

    /**
     *
     * @returns {WikidataQuantitySnak} the snak as json
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
     */
    equals(other: QuantitySnak): boolean {
        return this._amount === other._amount
            && this._upperBound === other._upperBound
            && this._lowerBound === other._lowerBound
            && this.unit === other.unit;
    }
}
