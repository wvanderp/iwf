"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
/**
 * class for descriptions
 *
 * @class
 */
class Description {
    /**
     *
     * @param {LabelAndDescription} label the label in json format
     */
    constructor(label) {
        this.language = label.language;
        this.value = label.value;
        this.internalID = uuid_1.v4();
    }
    /**
     * @returns {LabelAndDescription} the Description in a json format
     */
    toJSON() {
        return normalizeOutput_1.default({
            language: this.language,
            value: this.value
        });
    }
    /**
     * this function checks if two Descriptions are equal
     *
     * @static
     * @param {LabelAndDescription} a Description a
     * @param {LabelAndDescription} b Description b
     * @returns {boolean} true if the Descriptions are equal
     */
    static equals(a, b) {
        return a.language === b.language && a.value === b.value;
    }
}
exports.default = Description;
//# sourceMappingURL=Description.js.map