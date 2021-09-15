"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the MathSnak
 *
 * most used property of this type P2534 (defining formula)
 *
 * @class
 */
class MathSnak extends Snak_1.default {
    /**
     * @param {WikidataMathSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'math';
        this.value = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     *
     * @returns {WikidataMathSnak} the snak as json
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
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
     * @param {MathSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this.value === other.value;
    }
}
exports.default = MathSnak;
//# sourceMappingURL=MathSnak.js.map