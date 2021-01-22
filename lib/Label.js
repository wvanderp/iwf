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
        this.internalID = uuid_1.v4();
    }
    /**
     * @returns {LabelAndDescription} the label as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            language: this.language,
            value: this.value
        });
    }
    /**
     * this function checks if two labels are equal
     *
     * @static
     * @param {LabelAndDescription} a Label a
     * @param {LabelAndDescription} b Label b
     * @returns {boolean} true if the items are equal
     */
    static equals(a, b) {
        return a.language === b.language && a.value === b.value;
    }
}
exports.default = Label;
//# sourceMappingURL=Label.js.map