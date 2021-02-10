"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the TimeSnak
 *
 * most used property of this type P1619 (date of official opening)
 *
 * @class
 */
class TimeSnak extends Snak_1.default {
    /**
     * @param {WikidataTimeSnak} snak the snak for this class in json format
     */
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
    /**
     *
     * @returns {WikidataTimeSnak} the snak as json
     */
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
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {TimeSnak} a snak a
     * @param {TimeSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a, b) {
        return a.time === b.time
            && a.timezone === b.timezone
            && a.before === b.before
            && a.after === b.after
            && a.precision === b.precision
            && a.calendarmodel === b.calendarmodel;
    }
    /**
     * dates only so add all of the date (year, month, day)
     *
     * @param {string} property the property of the snak in 'P-form'
     * @param {Date} date the date for the snak
     * @param {CalendarModels} calendarModel the calendarModel for the snak
     * @returns {TimeSnak} the timeSnak
     */
    static fromDate(property, date, calendarModel = 'http://www.wikidata.org/entity/Q1985786') {
        const isoString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;
        return new TimeSnak({
            snaktype: 'value',
            property,
            datavalue: {
                value: {
                    time: isoString,
                    timezone: 0,
                    before: 0,
                    after: 0,
                    precision: 11,
                    calendarmodel: calendarModel
                },
                type: 'time'
            },
            datatype: 'time'
        });
    }
}
exports.default = TimeSnak;
//# sourceMappingURL=TimeSnak.js.map