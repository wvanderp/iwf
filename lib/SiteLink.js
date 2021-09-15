"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wikidata_properties_1 = require("wikidata-properties");
const uuid_1 = require("uuid");
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
/**
 * the class for a site link
 *
 * @class
 */
class SiteLink {
    /**
     * @param {WikidataSiteLink} siteLink The siteLink for this class
     */
    constructor(siteLink) {
        var _a;
        this.site = siteLink.site;
        this.title = siteLink.title;
        this._url = siteLink.url;
        this.badges = (_a = siteLink.badges) !== null && _a !== void 0 ? _a : [];
        this.internalID = (0, uuid_1.v4)();
    }
    /**
     * if the private property _url is set then we know the url already exists
     * else we look it up with wikidata-properties package
     *
     * @returns {string} the url of the site link
     */
    get url() {
        if (this._url !== undefined)
            return this._url;
        const url = wikidata_properties_1.siteDetails[this.site]
            .pageUrl
            .replace('$1', this.title);
        return `https:${url}`;
    }
    /**
     * @returns {WikidataSiteLink} the SiteLink in a json format
     */
    toJSON() {
        return (0, normalizeOutput_1.default)({
            site: this.site,
            title: this.title,
            badges: this.badges,
            url: this._url
        });
    }
}
exports.default = SiteLink;
//# sourceMappingURL=SiteLink.js.map