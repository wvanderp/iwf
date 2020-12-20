"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class MonolingualTextSnak extends Snak_1.default {
    constructor(snak) {
        var _a, _b;
        super(snak);
        this.language = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value.language;
        this.text = (_b = snak.datavalue) === null || _b === void 0 ? void 0 : _b.value.text;
    }
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    text: this.text,
                    language: this.language
                },
                type: 'monolingualtext'
            } : undefined,
            datatype: 'monolingualtext'
        });
    }
}
exports.default = MonolingualTextSnak;
//# sourceMappingURL=MonolingualTextSnak.js.map