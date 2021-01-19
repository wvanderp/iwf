"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * this function mainly exist because wikidata has the weird habit of indicating positive numbers with the plus sign (+)
 *
 * @private
 * @param {number} amount the number that should be formatted
 * @returns {string} the formatted number as a string
 */
function formatNumber(amount) {
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
class QuantitySnak extends Snak_1.default {
    /**
     * @param {WikidataQuantitySnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a, _b, _c, _d;
        super(snak);
        this._amount = undefined;
        this._upperBound = undefined;
        this._lowerBound = undefined;
        this.datatype = 'quantity';
        const amount = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value.amount;
        const upperBound = (_b = snak.datavalue) === null || _b === void 0 ? void 0 : _b.value.upperBound;
        const lowerBound = (_c = snak.datavalue) === null || _c === void 0 ? void 0 : _c.value.lowerBound;
        this._amount = amount;
        this._upperBound = upperBound;
        this._lowerBound = lowerBound;
        this.unit = (_d = snak.datavalue) === null || _d === void 0 ? void 0 : _d.value.unit;
    }
    get amount() {
        return Number(this._amount);
    }
    set amount(number) {
        this._amount = formatNumber(number);
    }
    get upperBound() {
        return Number(this._upperBound);
    }
    set upperBound(number) {
        this._upperBound = formatNumber(number);
    }
    get lowerBound() {
        return Number(this._lowerBound);
    }
    set lowerBound(number) {
        this._lowerBound = formatNumber(number);
    }
    /**
     *
     * @returns {WikidataQuantitySnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
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
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {QuantitySnak} a snak a
     * @param {QuantitySnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a, b) {
        return a._amount === b._amount
            && a._upperBound === b._upperBound
            && a._lowerBound === b._lowerBound
            && a.unit === b.unit;
    }
}
exports.default = QuantitySnak;
//# sourceMappingURL=QuantitySnak.js.map