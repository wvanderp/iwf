"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Reference_1 = __importDefault(require("./Reference"));
const arrayEqual_1 = __importStar(require("./utils/arrayEqual"));
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
        this.internalID = (0, uuid_1.v4)();
        this.qualifiers = Object.values((_a = statement.qualifiers) !== null && _a !== void 0 ? _a : {})
            .flat()
            .map((snak) => (0, snakGenerator_1.default)(snak));
        this.qualifiersOrder = (_b = statement['qualifiers-order']) !== null && _b !== void 0 ? _b : [];
        this.rank = statement.rank;
        this.mainsnak = (0, snakGenerator_1.default)(statement.mainsnak);
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
        return (0, normalizeOutput_1.default)({
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
    /**
     *
     * @param {Statement} other the other statement
     * @returns {boolean} if the two statements are equal
     */
    equals(other) {
        const idEqual = this.id === other.id;
        const typeEqual = this.type === other.type;
        const rankEqual = this.rank === other.rank;
        const qualifiersOrderEqual = (0, arrayEqual_1.default)(this.qualifiersOrder, other.qualifiersOrder);
        const snakEqual = this.mainsnak.equals(other.mainsnak);
        const referencesEqual = (0, arrayEqual_1.arrayEqualWith)(this.references, other.references, (a, b) => a.equals(b));
        const qualifiersEqual = (0, arrayEqual_1.arrayEqualWith)(this.qualifiers, other.qualifiers, (a, b) => a.equals(b));
        return idEqual
            && typeEqual
            && rankEqual
            && qualifiersOrderEqual
            && snakEqual
            && referencesEqual
            && qualifiersEqual;
    }
}
exports.default = Statement;
//# sourceMappingURL=Statement.js.map