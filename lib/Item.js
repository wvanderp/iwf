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
const Alias_1 = __importDefault(require("./Alias"));
const Statement_1 = __importDefault(require("./Statement"));
const Description_1 = __importDefault(require("./Description"));
const Label_1 = __importDefault(require("./Label"));
const SiteLink_1 = __importDefault(require("./SiteLink"));
const dateFormatter_1 = __importDefault(require("./utils/dateFormatter"));
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
const arrayEqual_1 = __importStar(require("./utils/arrayEqual"));
/**
 * @class
 */
class Item {
    /**
     *
     * @param {WikidataItem} item the item in json format
     */
    constructor(item) {
        this.pageid = item.pageid;
        this.ns = item.ns;
        this.title = item.title;
        this.lastrevid = item.lastrevid;
        this.modified = new Date(item.modified);
        this.id = item.id;
        this.type = item.type;
        this.internalID = (0, uuid_1.v4)();
        this.labels = Object.values(item.labels).map((label) => new Label_1.default(label));
        this.descriptions = Object.values(item.descriptions).map((description) => new Description_1.default(description));
        this.aliases = Object.values(item.aliases)
            .flatMap((alias) => (alias !== null ? alias.map((alias2) => new Alias_1.default(alias2)) : []));
        this.statements = Object.values(item.claims)
            .flat()
            .map((statement) => new Statement_1.default(statement));
        this.sitelinks = Object.values(item.sitelinks).map((siteLink) => new SiteLink_1.default(siteLink));
    }
    /**
     * this function checks if two items are equal
     *
     * @param {Item} other the other item
     * @returns {boolean} true if the items are equal
     */
    equals(other) {
        const pageidEqual = this.pageid === other.pageid;
        const nsEqual = this.ns === other.ns;
        const titleEqual = this.title === other.title;
        const lastrevidEqual = this.lastrevid === other.lastrevid;
        const modifiedEqual = (0, dateFormatter_1.default)(this.modified) === (0, dateFormatter_1.default)(other.modified);
        const idEqual = this.id === other.id;
        const typeEqual = this.type === other.type;
        const labelsEqual = (0, arrayEqual_1.default)(this.labels, other.labels);
        const descriptionsEqual = (0, arrayEqual_1.default)(this.descriptions, other.descriptions);
        const aliasesEqual = (0, arrayEqual_1.default)(this.aliases, other.aliases);
        const statementsEqual = (0, arrayEqual_1.arrayEqualWith)(this.statements, other.statements, (a, b) => a.equals(b));
        return pageidEqual
            && nsEqual
            && titleEqual
            && lastrevidEqual
            && modifiedEqual
            && idEqual
            && typeEqual
            && labelsEqual
            && descriptionsEqual
            && aliasesEqual
            && statementsEqual;
    }
    /**
     *
     * @param other the other item
     */
    // diff(other: Item): Changes[] {
    //     const labelChanges = labelDiff(this.labels, other.labels);
    //     const descriptionsChanges = descriptionsDiff(this.descriptions, other.descriptions);
    //     const aliasesChanges = aliasDiff(this.aliases, other.aliases);
    //     const statementsChanges = statementsDiff(this.statements, other.statements);
    //     const sitelinksChanges = siteLinksDiff(this.sitelinks, other.sitelinks);
    //     return [...labelChanges, ...descriptionsChanges, ...aliasesChanges, ...statementsChanges, ...sitelinksChanges];
    // }
    /**
     * @returns {WikidataItem} the item as json
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            pageid: this.pageid,
            ns: this.ns,
            title: this.title,
            lastrevid: this.lastrevid,
            modified: (0, dateFormatter_1.default)(this.modified),
            type: this.type,
            id: this.id,
            labels: this.labels
                .map((label) => label.toJSON())
                .reduce((accumulator, value) => ({ ...accumulator, [value.language]: value }), {}),
            descriptions: this.descriptions
                .map((description) => description.toJSON())
                .reduce((accumulator, value) => ({ ...accumulator, [value.language]: value }), {}),
            aliases: this.aliases
                .map((alias) => alias.toJSON())
                .reduce((accumulator, value) => {
                if (accumulator[value.language] === undefined) {
                    accumulator[value.language] = [];
                }
                accumulator[value.language].push(value);
                return accumulator;
            }, {}),
            claims: this.statements
                .map((statement) => statement.toJSON())
                .reduce((accumulator, value) => {
                if (accumulator[value.mainsnak.property] === undefined) {
                    accumulator[value.mainsnak.property] = [];
                }
                accumulator[value.mainsnak.property].push(value);
                return accumulator;
            }, {}),
            sitelinks: this.sitelinks
                .map((siteLink) => siteLink.toJSON())
                .reduce((accumulator, value) => ({ ...accumulator, [value.site]: value }), {})
        });
    }
}
exports.default = Item;
//# sourceMappingURL=Item.js.map