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
    get amount(): number;
    set amount(number: number);
    get upperBound(): number;
    set upperBound(number: number);
    get lowerBound(): number;
    set lowerBound(number: number);
    /**
     *
     * @returns {WikidataQuantitySnak} the snak as json
     */
    toJSON(): WikidataQuantitySnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {QuantitySnak} a snak a
     * @param {QuantitySnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: QuantitySnak, b: QuantitySnak): boolean;
}
//# sourceMappingURL=QuantitySnak.d.ts.map