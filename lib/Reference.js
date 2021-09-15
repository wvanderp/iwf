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
const arrayEqual_1 = __importStar(require("./utils/arrayEqual"));
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
const snakGenerator_1 = __importDefault(require("./utils/snakGenerator"));
/**
 * A class for References
 *
 * @class
 */
class Reference {
    /**
     *
     * @param {WikidataReference} reference the Reference in json format
     */
    constructor(reference) {
        this.hash = reference.hash;
        this.snaksOrder = reference['snaks-order'];
        this.internalID = (0, uuid_1.v4)();
        this.snaks = Object.values(reference.snaks)
            .flat()
            .map((snak) => (0, snakGenerator_1.default)(snak));
    }
    /**
     * @returns {WikidataReference} the Reference in a json format
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
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
    /**
     * this function checks if References are equal
     *
     * @param {Reference} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other) {
        return (0, arrayEqual_1.arrayEqualWith)(this.snaks, other.snaks, (a, b) => a.equals(b))
            && (0, arrayEqual_1.default)(this.snaksOrder, other.snaksOrder)
            && this.hash === other.hash;
    }
    /**
     * creates a new reference from snaks
     *
     * @static
     * @param {Snak} snaks the snaks for the reference
     * @returns {Reference} the reference objects
     */
    static fromSnaks(snaks) {
        return new Reference({
            snaks: snaks
                .map((snak) => snak.toJSON())
                .reduce((accumulator, value) => {
                if (accumulator[value.property] === undefined) {
                    accumulator[value.property] = [];
                }
                accumulator[value.property].push(value);
                return accumulator;
            }, {})
        });
    }
}
exports.default = Reference;
//# sourceMappingURL=Reference.js.map