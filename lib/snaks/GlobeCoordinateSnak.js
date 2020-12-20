"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snak_1 = __importDefault(require("../Snak"));
const normalizeOutput_1 = __importDefault(require("../utils/normalizeOutput"));
class GlobeCoordinateSnak extends Snak_1.default {
    constructor(snak) {
        var _a, _b, _c, _d, _e;
        super(snak);
        this.latitude = (_a = snak.datavalue) === null || _a === void 0 ? void 0 : _a.value.latitude;
        this.longitude = (_b = snak.datavalue) === null || _b === void 0 ? void 0 : _b.value.longitude;
        this.altitude = (_c = snak.datavalue) === null || _c === void 0 ? void 0 : _c.value.altitude;
        this.precision = (_d = snak.datavalue) === null || _d === void 0 ? void 0 : _d.value.precision;
        this.globe = (_e = snak.datavalue) === null || _e === void 0 ? void 0 : _e.value.globe;
    }
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
            datatype: 'globe-coordinate'
        });
    }
}
exports.default = GlobeCoordinateSnak;
//# sourceMappingURL=GlobeCoordinateSnak.js.map