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
        this.internalID = (0, uuid_1.v4)();
    }
    /**
     * @returns {LabelAndDescription} the Description in a json format
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            language: this.language,
            value: this.value
        });
    }
    /**
     * this function checks if two descriptions are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the descriptions are equal
     */
    equals(other) {
        return this.language === other.language && this.value === other.value;
    }
}
exports.default = Description;
//# sourceMappingURL=Description.js.map