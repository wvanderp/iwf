import { QuantitySnak as WikidataQuantitySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the QuantitySnak
 *
 * most used property of this type P1215 (apparent magnitude)
 *
 * @class
 */
export default class QuantitySnak extends Snak {
    private _amount;
    private _upperBound;
    private _lowerBound;
    unit: string | undefined;
    datatype: string;
    /**
     * @param {WikidataQuantitySnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataQuantitySnak);
    /**
     * @returns {number} the amount of the quantity
     */
    get amount(): number;
    /**
     * @param {number} number the number that the amount will be set to
     */
    set amount(number: number);
    /**
     * @returns {number} the upperBound of the quantity
     */
    get upperBound(): number;
    /**
     * @param {number} number the number that the upperBound will be set to
     */
    set upperBound(number: number);
    /**
     * @returns {number} the lowerBound of the quantity
     */
    get lowerBound(): number;
    /**
     * @param {number} number the number that the lowerBound will be set to
     */
    set lowerBound(number: number);
    /**
     *
     * @returns {WikidataQuantitySnak} the snak as json
     */
    toJSON(): WikidataQuantitySnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {QuantitySnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: QuantitySnak): boolean;
}
//# sourceMappingURL=QuantitySnak.d.ts.map