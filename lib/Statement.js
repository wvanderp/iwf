"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Reference_1 = __importDefault(require("./Reference"));
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
const snakGenerator_1 = __importDefault(require("./utils/snakGenerator"));
/**
 * @class
 */
class Statement {
    /**
     *
     * @param {wikidataStatement} statement the statement in a json format
     */
    constructor(statement) {
        var _a, _b;
        this.id = statement.id;
        this.type = statement.type;
        this.internalID = uuid_1.v4();
        this.qualifiers = Object.values((_a = statement.qualifiers) !== null && _a !== void 0 ? _a : {})
            .flat()
            .map((snak) => snakGenerator_1.default(snak));
        this.qualifiersOrder = (_b = statement['qualifiers-order']) !== null && _b !== void 0 ? _b : [];
        this.rank = statement.rank;
        this.mainsnak = snakGenerator_1.default(statement.mainsnak);
        this.references = statement.references
            ? Object.values(statement.references).map((reference) => new Reference_1.default(reference))
            : [];
    }
    /**
     * @returns {wikidataStatement} the statement in a json format
     */
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
    /**
     * creates a statement from a snak
     *
     * @param {Snak} snak the snak for the statement
     * @returns {Statement} the statement
     */
    static fromSnak(snak) {
        return new Statement({
            mainsnak: snak.toJSON(),
            type: 'statement',
            rank: 'normal'
        });
    }
}
exports.default = Statement;
//# sourceMappingURL=Statement.js.map