"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Snak {
    constructor(snak) {
        this.snaktype = snak.snaktype;
        this.property = snak.property;
        this.hash = snak.hash;
    }
    get hasValue() {
        return this.snaktype === 'value';
    }
}
exports.default = Snak;
//# sourceMappingURL=Snak.js.map