"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the CommonsMediaSnak
 *
 * most used property of this type P18 (image)
 *
 * @class
 */
class CommonsMediaSnak extends Snak_1.default {
    /**
     * @param {WikidataCommonsMediaSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a, _b;
        super(snak);
        this.datatype = 'commonsMedia';
        this.fileName = (_b = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * gets the link to the image.
     * uses the special:redirect function of wiki commons to find the right url
     *
     * @returns {string} the link to the image
     */
    get imageLink() {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.fileName}`;
    }
    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    get commonsLink() {
        return `https://commons.wikimedia.org/wiki/File:${this.fileName}`;
    }
    /**
     *
     * @returns {WikidataCommonsMediaSnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.fileName,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @param {CommonsMediaSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return this.fileName === other.fileName;
    }
}
exports.default = CommonsMediaSnak;
//# sourceMappingURL=CommonsMediaSnak.js.map