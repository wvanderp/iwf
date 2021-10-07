"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
/**
 * class for aliases
 *
 * @class
 */
class Alias {
    /**
     *
     * @param {LabelAndDescription} alias  the alias in json format
     */
    constructor(alias) {
        this.language = alias.language;
        this.value = alias.value;
        this.internalID = (0, uuid_1.v4)();
    }
    /**
     * @returns {LabelAndDescription} the alias in a json format
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            language: this.language,
            value: this.value
        });
    }
    /**
     * this function checks if two Aliases are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the Aliases are equal
     */
    equals(other) {
        return this.language === other.language && this.value === other.value;
    }
}
exports.default = Alias;
//# sourceMappingURL=Alias.js.map