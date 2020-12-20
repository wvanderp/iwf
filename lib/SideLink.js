"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeOutput_1 = __importDefault(require("./utils/normalizeOutput"));
class SideLink {
    constructor(siteLink) {
        var _a;
        this.site = siteLink.site;
        this.title = siteLink.title;
        this.url = siteLink.url;
        this.badges = (_a = siteLink.badges) !== null && _a !== void 0 ? _a : [];
    }
    toJSON() {
        return normalizeOutput_1.default({
            site: this.site,
            title: this.title,
            badges: this.badges,
            url: this.url
        });
    }
}
exports.default = SideLink;
//# sourceMappingURL=SideLink.js.map