import {
    Snak as wikidataSnak,
    StringSnak as WikidataStringSnak,
    URLSnak as WikidataUrlSnak,
    WikibaseItemSnak as WikidataItemSnak,
    TimeSnak as WikidataTimeSnak,
    MonolingualTextSnak as WikidataMonolingualTextSnak,
    ExternalIdentifierSnak as WikidataExternalIdentifierSnak,
    QuantitySnak as WikidataQuantitySnak,
    GlobeCoordinateSnak as WikidataGlobeCoordinateSnak,
    CommonsMediaSnak as WikidataCommonsSnak,
    MathSnak as WikidataMathSnak,
    TabularDataSnak as WikidataTabularDataSnak,
    MusicalNotationSnak as WikidataMusicSnak,
    GeoShapeSnak as WikidataGeoShapeSnak,
    WikibasePropertySnak as WikidataWikibasePropertySnak,
} from '@wmde/wikibase-datamodel-types';

import CommonsMediaSnak from '../snaks/CommonsMediaSnak';
import ExternalIdentifierSnak from '../snaks/ExternalIdentifierSnak';
import GeoShapeSnak from '../snaks/GeoShapeSnak';
import GlobeCoordinateSnak from '../snaks/GlobeCoordinateSnak';
import MathSnak from '../snaks/MathSnak';
import MonolingualTextSnak from '../snaks/MonolingualTextSnak';
import MusicalNotationSnak from '../snaks/MusicalNotationSnak';
import QuantitySnak from '../snaks/QuantitySnak';
import { Snaks } from '../types/SnaksType';
import StringSnak from '../snaks/StringSnak';
import TabularDataSnak from '../snaks/TabularDataSnak';
import TimeSnak from '../snaks/TimeSnak';
import URLSnak from '../snaks/URLSnak';
import WikibaseItemSnak from '../snaks/WikibaseItemSnak';
import WikibasePropertySnak from '../snaks/WikibasePropertySnak';

/**
 * this function takes the json version of a snak and passes it to the proper constructor
 *
 * @private
 * @param {wikidataSnak} snak the snak that needs a constructor
 * @throws {Error} if the snak type is not supported
 * @returns {Snaks} the snak as a class
 */
export default function snakGenerator(snak: wikidataSnak): Snaks {
    switch (snak.datatype) {
        case 'string': {
            return new StringSnak(snak as WikidataStringSnak);
        }

        case 'url': {
            return new URLSnak(snak as WikidataUrlSnak);
        }

        case 'wikibase-item': {
            return new WikibaseItemSnak(snak as WikidataItemSnak);
        }

        case 'time': {
            return new TimeSnak(snak as WikidataTimeSnak);
        }

        case 'monolingualtext': {
            return new MonolingualTextSnak(snak as WikidataMonolingualTextSnak);
        }

        case 'external-id': {
            return new ExternalIdentifierSnak(snak as WikidataExternalIdentifierSnak);
        }

        case 'quantity': {
            return new QuantitySnak(snak as WikidataQuantitySnak);
        }

        case 'globe-coordinate': {
            return new GlobeCoordinateSnak(snak as WikidataGlobeCoordinateSnak);
        }

        case 'commonsMedia': {
            return new CommonsMediaSnak(snak as WikidataCommonsSnak);
        }

        case 'math': {
            return new MathSnak(snak as WikidataMathSnak);
        }

        case 'tabular-data': {
            return new TabularDataSnak(snak as WikidataTabularDataSnak);
        }

        case 'musical-notation': {
            return new MusicalNotationSnak(snak as WikidataMusicSnak);
        }

        case 'geo-shape': {
            return new GeoShapeSnak(snak as WikidataGeoShapeSnak);
        }

        case 'wikibase-property': {
            return new WikibasePropertySnak(snak as WikidataWikibasePropertySnak);
        }

        default: {
            throw new Error(`the value of ${snak.datatype} is not a valid snak type`);
        }
    }
}
