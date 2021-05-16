"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the StringSnak
 *
 * most used property of this type P1545 (series ordinal)
 *
 * @class
 */
class StringSnak extends Snak_1.default {
    /**
     * @param {WikidataStringSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'string';
        this.value = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     *
     * @returns {WikidataStringSnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @param {StringSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this.value === other.value;
    }
    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} string the string
     * @returns {StringSnak} a snak with the given properties
     */
    static fromString(property, string) {
        return new StringSnak({
            snaktype: 'value',
            property,
            datatype: 'string',
            datavalue: {
                value: string,
                type: 'string'
            }
        });
    }
}
exports.default = StringSnak;
//# sourceMappingURL=StringSnak.js.map