"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Item_1 = __importDefault(require("../Item"));
/**
 * @param {string} qid the id of the entity
 * @returns {string} the url with qid
 */
function baseURL(qid) {
    return `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
}
/**
 * @param {string} qid the id of the entity
 * @returns {Promise<Item>} the promise of a wikidata Item
 */
async function request(qid) {
    const url = baseURL(qid);
    const { data } = await axios_1.default.get(url);
    const statementData = Object.values(data.entities)[0];
    return new Item_1.default(statementData);
}
exports.default = request;
//# sourceMappingURL=request.js.map