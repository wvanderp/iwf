"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommonsMediaSnak_1 = __importDefault(require("../snaks/CommonsMediaSnak"));
const ExternalIdentifierSnak_1 = __importDefault(require("../snaks/ExternalIdentifierSnak"));
const GeoShapeSnak_1 = __importDefault(require("../snaks/GeoShapeSnak"));
const GlobeCoordinateSnak_1 = __importDefault(require("../snaks/GlobeCoordinateSnak"));
const MathSnak_1 = __importDefault(require("../snaks/MathSnak"));
const MonolingualTextSnak_1 = __importDefault(require("../snaks/MonolingualTextSnak"));
const MusicalNotationSnak_1 = __importDefault(require("../snaks/MusicalNotationSnak"));
const QuantitySnak_1 = __importDefault(require("../snaks/QuantitySnak"));
const StringSnak_1 = __importDefault(require("../snaks/StringSnak"));
const TabularDataSnak_1 = __importDefault(require("../snaks/TabularDataSnak"));
const TimeSnak_1 = __importDefault(require("../snaks/TimeSnak"));
const UrlSnak_1 = __importDefault(require("../snaks/UrlSnak"));
const WikibaseItemSnak_1 = __importDefault(require("../snaks/WikibaseItemSnak"));
function snakGenerator(snak) {
    switch (snak.datatype) {
        case 'string': {
            return new StringSnak_1.default(snak);
        }
        case 'url': {
            return new UrlSnak_1.default(snak);
        }
        case 'wikibase-item': {
            return new WikibaseItemSnak_1.default(snak);
        }
        case 'time': {
            return new TimeSnak_1.default(snak);
        }
        case 'monolingualtext': {
            return new MonolingualTextSnak_1.default(snak);
        }
        case 'external-id': {
            return new ExternalIdentifierSnak_1.default(snak);
        }
        case 'quantity': {
            return new QuantitySnak_1.default(snak);
        }
        case 'globe-coordinate': {
            return new GlobeCoordinateSnak_1.default(snak);
        }
        case 'commonsMedia': {
            return new CommonsMediaSnak_1.default(snak);
        }
        case 'math': {
            return new MathSnak_1.default(snak);
        }
        case 'tabular-data': {
            return new TabularDataSnak_1.default(snak);
        }
        case 'musical-notation': {
            return new MusicalNotationSnak_1.default(snak);
        }
        case 'geo-shape': {
            return new GeoShapeSnak_1.default(snak);
        }
        default: {
            throw new Error(`the value of ${snak.datatype} is not a valid snak type`);
        }
    }
}
exports.default = snakGenerator;
//# sourceMappingURL=snakGenerator.js.map