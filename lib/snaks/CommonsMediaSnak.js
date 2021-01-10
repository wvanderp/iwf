"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class CommonsMediaSnak extends Snak_1.default {
    constructor(snak) {
        var _a, _b;
        super(snak);
        this.datatype = 'commonsMedia';
        this.fileName = (_b = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
    }
    get imageLink() {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.fileName}`;
    }
    get commonsLink() {
        return `https://commons.wikimedia.org/wiki/File:${this.fileName}`;
    }
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
}
exports.default = CommonsMediaSnak;
//# sourceMappingURL=CommonsMediaSnak.js.map