"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class TabularDataSnak extends Snak_1.default {
    constructor(snak) {
        var _a;
        super(snak);
        this.value = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value;
    }
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: 'tabular-data'
        });
    }
}
exports.default = TabularDataSnak;
//# sourceMappingURL=TabularDataSnak.js.map