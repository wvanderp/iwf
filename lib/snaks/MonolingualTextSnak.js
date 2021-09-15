"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the MonolingualTextSnak
 *
 * most used property of this type P1476 (title)
 *
 * @class
 */
class MonolingualTextSnak extends Snak_1.default {
    /**
     *
     * @param {WikidataMonolingualTextSnak} snak the snak that will be parsed
     */
    constructor(snak) {
        var _a, _b;
        super(snak);
        this.datatype = 'monolingualtext';
        this.language = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value.language;
        this.text = (_b = snak.datavalue) === null || _b === void 0 ? void 0 : _b.value.text;
    }
    /**
     *
     * @returns {WikidataMonolingualTextSnak} the snak as json
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    text: this.text,
                    language: this.language
                },
                type: 'monolingualtext'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @param {MonolingualTextSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this.text === other.text && this.language === other.language;
    }
}
exports.default = MonolingualTextSnak;
//# sourceMappingURL=MonolingualTextSnak.js.map