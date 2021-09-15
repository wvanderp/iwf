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
        this.url = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * @alias url
     * @returns {string | undefined} the value of the snak
     */
    get value() {
        return this.url;
    }
    /**
     * @alias url
     * @param {string | undefined} value the value of the snak
     */
    set value(value) {
        this.url = value;
    }
    /**
     *
     * @returns {WikidataURLSnak} the snak as json
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.url,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @param {URLSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this.value === other.value;
    }
    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} url the url
     * @returns {URLSnak} a snak with the given properties
     */
    static fromURL(property, url) {
        return new URLSnak({
            snaktype: 'value',
            property,
            datatype: 'url',
            datavalue: {
                value: url,
                type: 'string'
            }
        });
    }
}
exports.default = URLSnak;
//# sourceMappingURL=UrlSnak.js.map