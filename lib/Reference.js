"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
const snakGenerator_1 = __importDefault(require("./utils/snakGenerator"));
class Reference {
    constructor(reference) {
        this.hash = reference.hash;
        this.snaksOrder = reference['snaks-order'];
        this.snaks = Object.values(reference.snaks)
            .flat()
            .map((snak) => snakGenerator_1.default(snak));
    }
    toJSON() {
        return normalizeOutput_1.default({
            hash: this.hash,
            snaks: this.snaks
                .map((snak) => snak.toJSON())
                .reduce((accumulator, value) => {
                if (accumulator[value.property] === undefined) {
                    accumulator[value.property] = [];
                }
                accumulator[value.property].push(value);
                return accumulator;
            }, {}),
            'snaks-order': this.snaksOrder
        });
    }
}
exports.default = Reference;
//# sourceMappingURL=Reference.js.map