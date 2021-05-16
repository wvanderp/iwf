"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the ExternalIdentifierSnak
 *
 * most used property of this type P698 (PubMed ID)
 *
 * @class
 */
class ExternalIdentifierSnak extends Snak_1.default {
    /**
     * @param {WikidataExternalIdentifierSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a, _b;
        super(snak);
        this.datatype = 'external-id';
        this.id = (_b = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
    }
    /**
     *
     * @returns {WikidataExternalIdentifierSnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.id,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @param {ExternalIdentifierSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this.id === other.id;
    }
    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} id the external identifier
     * @returns {ExternalIdentifierSnak} a snak with the given properties
     */
    static fromID(property, id) {
        return new ExternalIdentifierSnak({
            snaktype: 'value',
            property,
            datatype: 'external-id',
            datavalue: {
                value: id,
                type: 'string'
            }
        });
    }
}
exports.default = ExternalIdentifierSnak;
//# sourceMappingURL=ExternalIdentifierSnak.js.map