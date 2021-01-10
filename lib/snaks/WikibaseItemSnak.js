"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class WikibaseItemSnak extends Snak_1.default {
    constructor(snak) {
        var _a;
        super(snak);
        this.datatype = 'wikibase-item';
        this._numericID = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value['numeric-id'];
    }
    get id() {
        return this.hasValue ? `Q${this._numericID}` : undefined;
    }
    set id(value) {
        if (value === undefined) {
            this._numericID = undefined;
            this.snaktype = 'novalue';
            return;
        }
        this._numericID = Number.parseInt(value.slice(1), 10);
    }
    get numericID() {
        return this._numericID;
    }
    set numericID(value) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }
        this._numericID = value;
    }
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    'entity-type': 'item',
                    'numeric-id': this._numericID,
                    id: this.id
                },
                type: 'wikibase-entityid'
            } : undefined,
            datatype: this.datatype
        });
    }
}
exports.default = WikibaseItemSnak;
//# sourceMappingURL=WikibaseItemSnak.js.map