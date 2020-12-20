"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
class Alias {
    constructor(alias) {
        this.language = alias.language;
        this.value = alias.value;
    }
    toJSON() {
        return normalizeOutput_1.default({
            language: this.language,
            value: this.value
        });
    }
}
exports.default = Alias;
//# sourceMappingURL=Alias.js.map