"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
/**
 * class for labels
 *
 * @class
 */
class Label {
    /**
     * @param {LabelAndDescription} label the label for this class in json format
     */
    constructor(label) {
        this.language = label.language;
        this.value = label.value;
        this.internalID = (0, uuid_1.v4)();
    }
    /**
     * @returns {LabelAndDescription} the label as json
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            language: this.language,
            value: this.value
        });
    }
    /**
     * this function checks if two Labels are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the Labels are equal
     */
    equals(other) {
        return this.language === other.language && this.value === other.value;
    }
    /**
     *
     * @param {string} language the language of the label
     * @param {string} value the value of the label
     * @returns {Label} the label object
     */
    static fromString(language, value) {
        return new Label({ language, value });
    }
}
exports.default = Label;
//# sourceMappingURL=Label.js.map