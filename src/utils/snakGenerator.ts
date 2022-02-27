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
import properties from 'wikidata-properties';

import Snak from '../Snak';

import CommonsMediaSnak from '../snaks/CommonsMediaSnak';
import ExternalIdentifierSnak from '../snaks/ExternalIdentifierSnak';
import GeoShapeSnak from '../snaks/GeoShapeSnak';
import GlobeCoordinateSnak from '../snaks/GlobeCoordinateSnak';
import MathSnak from '../snaks/MathSnak';
import MonolingualTextSnak from '../snaks/MonolingualTextSnak';
import MusicalNotationSnak from '../snaks/MusicalNotationSnak';
import QuantitySnak from '../snaks/QuantitySnak';
import StringSnak from '../snaks/StringSnak';
import TabularDataSnak from '../snaks/TabularDataSnak';
import TimeSnak from '../snaks/TimeSnak';
import URLSnak from '../snaks/UrlSnak';
import WikibaseItemSnak from '../snaks/WikibaseItemSnak';
import WikibasePropertySnak from '../snaks/WikibasePropertySnak';

/**
 * this function takes the json version of a snak and passes it to the proper constructor
 *
 * @private
 * @param {wikidataSnak} snak the snak that needs a constructor
 * @returns {Snak} the snak as a class
 */
export default function snakGenerator(snak: wikidataSnak): Snak {
    const directType = snak.datatype;
    const dataValueType = snak.datavalue?.type;
    const propertyType = properties.getProperty(snak.property)?.datatype;

    const datatype = directType ?? dataValueType ?? propertyType;

    if (datatype === undefined) {
        throw new Error(`did not find a valid snak type in ${JSON.stringify(snak)}`);
    }

    switch (datatype) {
        case 'string': {
            return new StringSnak(snak as WikidataStringSnak);
        }

        case 'url': {
            return new URLSnak(snak as WikidataUrlSnak);
        }
        case 'wikibase-entityid':
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

        case 'globecoordinate':
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
            throw new Error(`the value of ${datatype} is not a valid snak type`);
        }
    }
}
