"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reference_1 = __importDefault(require("./Reference"));
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
const snakGenerator_1 = __importDefault(require("./utils/snakGenerator"));
class Claim {
    constructor(claim) {
        var _a, _b;
        this.id = claim.id;
        this.type = claim.type;
        this.qualifiers = Object.values((_a = claim.qualifiers) !== null && _a !== void 0 ? _a : {})
            .flat()
            .map((snak) => snakGenerator_1.default(snak));
        this.qualifiersOrder = (_b = claim['qualifiers-order']) !== null && _b !== void 0 ? _b : [];
        this.rank = claim.rank;
        this.mainsnak = snakGenerator_1.default(claim.mainsnak);
        this.references = claim.references
            ? Object.values(claim.references).map((reference) => new Reference_1.default(reference))
            : [];
    }
    toJSON() {
        const references = this.references.map((reference) => reference.toJSON());
        const qualifiers = this.qualifiers
            .map((qualifier) => qualifier.toJSON())
            .reduce((accumulator, value) => {
            if (accumulator[value.property] === undefined) {
                accumulator[value.property] = [];
            }
            accumulator[value.property].push(value);
            return accumulator;
        }, {});
        return normalizeOutput_1.default({
            mainsnak: this.mainsnak.toJSON(),
            type: this.type,
            qualifiers: Object.keys(qualifiers).length === 0 ? undefined : qualifiers,
            'qualifiers-order': this.qualifiersOrder.length === 0 ? undefined : this.qualifiersOrder,
            id: this.id,
            rank: this.rank,
            references: references.length === 0 ? undefined : references
        });
    }
}
exports.default = Claim;
//# sourceMappingURL=Claim.js.map