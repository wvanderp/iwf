"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wikidata_properties_1 = require("wikidata-properties");
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
class SiteLink {
    constructor(siteLink) {
        var _a;
        this.site = siteLink.site;
        this.title = siteLink.title;
        this._url = siteLink.url;
        this.badges = (_a = siteLink.badges) !== null && _a !== void 0 ? _a : [];
    }
    get url() {
        if (this._url !== undefined)
            return this._url;
        const template = wikidata_properties_1.siteDetails[this.site].pageUrl;
        return template.replace('$1', this.title);
    }
    toJSON() {
        return normalizeOutput_1.default({
            site: this.site,
            title: this.title,
            badges: this.badges,
            url: this._url
        });
    }
}
exports.default = SiteLink;
//# sourceMappingURL=SiteLink.js.map