"use strict";
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
        this.internalID = uuid_1.v4();
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
     * @returns {WikidataItem} the item as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            pageid: this.pageid,
            ns: this.ns,
            title: this.title,
            lastrevid: this.lastrevid,
            modified: dateFormatter_1.default(this.modified),
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