"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the wikibase property snak
 *
 * most used property of this type P1659 (see also)
 *
 * @class
 */
class WikibasePropertySnak extends Snak_1.default {
    /**
     * @param {WikidataWikibasePropertySnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'wikibase-property';
        this._numericID = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value['numeric-id'];
    }
    /**
     * returns the ID of the property with the P
     *
     * @returns {string | undefined} the ID of the property with the P
     */
    get id() {
        return this.hasValue ? `P${this._numericID}` : undefined;
    }
    /**
     * This function parses the string by slicing the first char and then number.parseInt
     * if value is undefined it also sets the snaktype to 'novalue
     *
     * @property {string | undefined} value the value that you want to set
     */
    set id(value) {
        if (value === undefined) {
            this._numericID = undefined;
            this.snaktype = 'novalue';
            return;
        }
        this._numericID = Number.parseInt(value.slice(1), 10);
    }
    /**
     * returns the numeric part of the property
     *
     * @returns {number | undefined} the numeric ID of the property
     */
    get numericID() {
        return this._numericID;
    }
    /**
     * if value is undefined it also sets the snaktype to 'novalue
     *
     * @property {number | undefined} value the numeric id to be set in the snak
     */
    set numericID(value) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }
        this._numericID = value;
    }
    /**
     *
     * @returns {WikidataWikibasePropertySnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            datavalue: {
                value: {
                    'entity-type': 'property',
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid'
            },
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {WikibasePropertySnak} a snak a
     * @param {WikibasePropertySnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a, b) {
        return a._numericID === b._numericID;
    }
}
exports.default = WikibasePropertySnak;
//# sourceMappingURL=WikibasePropertySnak.js.map