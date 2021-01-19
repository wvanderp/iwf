"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the MusicalNotationSnak
 *
 * most used property of this type P6883 (LilyPond notation)
 *
 * @class
 */
class MusicalNotationSnak extends Snak_1.default {
    /**
     * @param {WikidataMusicalNotationSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'musical-notation';
        this.value = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     *
     * @returns {WikidataMusicalNotationSnak} the snak as json
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
     * @static
     * @param {MusicalNotationSnak} a snak a
     * @param {MusicalNotationSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a, b) {
        return a.value === b.value;
    }
}
exports.default = MusicalNotationSnak;
//# sourceMappingURL=MusicalNotationSnak.js.map