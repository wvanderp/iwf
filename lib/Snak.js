"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
/**
 * @abstract
 * @class
 */
class Snak {
    /**
     *
     * @param {WikidataSnaks} snak the snak in a json format
     */
    constructor(snak) {
        this.snaktype = snak.snaktype;
        this.property = snak.property;
        this.hash = snak.hash;
        this.internalID = uuid_1.v4();
    }
    /**
     * @returns {boolean} true if the snak has a value
     */
    get hasValue() {
        return this.snaktype === 'value';
    }
}
exports.default = Snak;
//# sourceMappingURL=Snak.js.map