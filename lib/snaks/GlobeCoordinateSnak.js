"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
/**
 * class for the GlobeCoordinateSnak
 *
 * most used property of this type P625 (coordinate location)
 *
 * @class
 */
class GlobeCoordinateSnak extends Snak_1.default {
    /**
     * @param {WikidataGlobeCoordinateSnak} snak the snak for this class in json format
     */
    constructor(snak) {
        var _a, _b, _c, _d, _e;
        super(snak);
        this.datatype = 'globe-coordinate';
        this.latitude = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value.latitude;
        this.longitude = (_b = snak.datavalue) === null || _b === void 0 ? void 0 : _b.value.longitude;
        this.altitude = (_c = snak.datavalue) === null || _c === void 0 ? void 0 : _c.value.altitude;
        this.precision = (_d = snak.datavalue) === null || _d === void 0 ? void 0 : _d.value.precision;
        this.globe = (_e = snak.datavalue) === null || _e === void 0 ? void 0 : _e.value.globe;
    }
    /**
     *
     * @returns {WikidataGlobeCoordinateSnak} the snak as json
     */
    toJSON() {
        return normalizeOutput_1.default({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    altitude: this.altitude,
                    precision: this.precision,
                    globe: this.globe
                },
                type: 'globecoordinate'
            } : undefined,
            datatype: this.datatype
        });
    }
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {GlobeCoordinateSnak} a snak a
     * @param {GlobeCoordinateSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a, b) {
        return a.latitude === b.latitude
            && a.longitude === b.longitude
            && a.altitude === b.altitude
            && a.precision === b.precision
            && a.globe === b.globe;
    }
}
exports.default = GlobeCoordinateSnak;
//# sourceMappingURL=GlobeCoordinateSnak.js.map