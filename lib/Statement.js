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
        var _c, _d;
        this.id = statement.id;
        this.type = statement.type;
        this.internalID = uuid_1.v4();
        this.qualifiers = Object.values((_c = statement.qualifiers) !== null && _c !== void 0 ? _c : {})
            .flat()
            .map((snak) => snakGenerator_1.default(snak));
        this.qualifiersOrder = (_d = statement['qualifiers-order']) !== null && _d !== void 0 ? _d : [];
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
    /**
     *
     * @param {Statement} a the first statement
     * @param {Statement} b the second statement
     * @returns {boolean} if the two statements are equal
     */
    static equals(a, b) {
        return a.mainsnak.equals(b.mainsnak);
    }
    /**
     *
     * @param {Statement} a the first statement
     * @param {Statement} b the second statement
     * @returns {boolean} if the two statements are equal
     */
    static deepEquals(a, b) {
        const snaks = Statement.equals(a, b);
        // references should be equal
        const references = arrayEqual_1.arrayEqualWith(a.references, b.references, (_a, _b) => _a.equals(_b));
        // qualifiers should be equal
        const qualifiers = arrayEqual_1.default(a.qualifiersOrder, b.qualifiersOrder);
        // qualifiersOrder should be equal
        const qualifiersOrder = arrayEqual_1.default(a.qualifiersOrder, b.qualifiersOrder);
        return snaks && references && qualifiers && qualifiersOrder;
    }
}
exports.default = Statement;
//# sourceMappingURL=Statement.js.map