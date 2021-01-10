"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class ExternalIdentifierSnak extends Snak_1.default {
    constructor(snak) {
        var _a, _b;
        super(snak);
        this.datatype = 'external-id';
        this.id = (_b = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
    }
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
}
exports.default = ExternalIdentifierSnak;
//# sourceMappingURL=ExternalIdentifierSnak.js.map