"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the WikibaseItemSnak
 *
 * most used property of this type P2860 (cites work)
 *
 * @class
 */
class WikibaseItemSnak extends Snak_1.default {
    /**
     * @param {WikidataWikibaseItemSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'wikibase-item';
        this._numericID = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value['numeric-id'];
    }
    /**
     * @alias id
     * @returns {string | undefined} the value of the snak
     */
    get id() {
        return this.hasValue ? `Q${this._numericID}` : undefined;
    }
    /**
     * @alias id
     * @param {string | undefined} value the value of the snak
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
     * @alias numericID
     * @returns {number | undefined} the value of the snak
     */
    get numericID() {
        return this._numericID;
    }
    /**
     * @alias numericID
     * @param {number | undefined} value the value of the snak
     */
    set numericID(value) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }
        this._numericID = value;
    }
    /**
     *
     * @returns {WikidataWikibaseItemSnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    'entity-type': 'item',
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @param {WikibaseItemSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this._numericID === other._numericID;
    }
}
exports.default = WikibaseItemSnak;
//# sourceMappingURL=WikibaseItemSnak.js.map