"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the URLSnak
 *
 * most used property of this type P854 (reference URL)
 *
 * @class
 */
class URLSnak extends Snak_1.default {
    /**
     * @param {WikidataURLSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'url';
        this.value = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     *
     * @returns {WikidataURLSnak} the snak as json
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
     * @param {URLSnak} a snak a
     * @param {URLSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a, b) {
        return a.value === b.value;
    }
}
exports.default = URLSnak;
//# sourceMappingURL=UrlSnak.js.map