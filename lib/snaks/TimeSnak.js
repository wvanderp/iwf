"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class TimeSnak extends Snak_1.default {
    constructor(snak) {
        var _a, _b, _c, _d, _e, _f;
        super(snak);
        this.datatype = 'time';
        this.time = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value.time;
        this.timezone = (_b = snak.datavalue) === null || _b === void 0 ? void 0 : _b.value.timezone;
        this.before = (_c = snak.datavalue) === null || _c === void 0 ? void 0 : _c.value.before;
        this.after = (_d = snak.datavalue) === null || _d === void 0 ? void 0 : _d.value.after;
        this.precision = (_e = snak.datavalue) === null || _e === void 0 ? void 0 : _e.value.precision;
        this.calendarmodel = (_f = snak.datavalue) === null || _f === void 0 ? void 0 : _f.value.calendarmodel;
    }
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    time: this.time,
                    timezone: this.timezone,
                    before: this.before,
                    after: this.after,
                    precision: this.precision,
                    calendarmodel: this.calendarmodel
                },
                type: 'time'
            } : undefined,
            datatype: this.datatype
        });
    }
}
exports.default = TimeSnak;
//# sourceMappingURL=TimeSnak.js.map