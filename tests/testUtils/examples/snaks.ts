import {
    CommonsMediaSnak as WikidataCommonsMediaSnak,
    ExternalIdentifierSnak as WikidataExternalIdentifierSnak,
    GeoShapeSnak as WikidataGeoShapeSnak,
    GlobeCoordinateSnak as WikidataGlobeCoordinateSnak,
    MathSnak as WikidataMathSnak,
    MonolingualTextSnak as WikidataMonolingualTextSnak,
    MusicalNotationSnak as WikidataMusicalNotationSnak,
    QuantitySnak as WikidataQuantitySnak,
    StringSnak as WikidataStringSnak,
    TabularDataSnak as WikidataTabularDataSnak,
    TimeSnak as WikidataTimeSnak,
    URLSnak as WikidataURLSnak,
    WikibaseItemSnak as WikidataWikibaseItemSnak,
    WikibasePropertySnak as WikidataWikibasePropertySnak
} from '@wmde/wikibase-datamodel-types';

import {
    CommonsMediaSnak,
    ExternalIdentifierSnak,
    GeoShapeSnak,
    GlobeCoordinateSnak,
    MathSnak,
    MonolingualTextSnak,
    MusicalNotationSnak,
    QuantitySnak,
    StringSnak,
    TabularDataSnak,
    TimeSnak,
    URLSnak,
    WikibaseItemSnak,
    WikibasePropertySnak
} from '../../../src';

// CommonsMediaSnak
const commonsMediaJson: WikidataCommonsMediaSnak = {
    snaktype: 'value',
    property: 'P18',
    datavalue: {
        value: 'File:Example.jpg',
        type: 'string'
    },
    datatype: 'commonsMedia'
};

const commonsMediaSnak = new CommonsMediaSnak(commonsMediaJson);
export { commonsMediaSnak };

// ExternalIdSnak
const externalIdJson: WikidataExternalIdentifierSnak = {
    snaktype: 'value',
    property: 'P345',
    datavalue: {
        value: 'tt0111161',
        type: 'string'
    },
    datatype: 'external-id'
};

const externalIdSnak = new ExternalIdentifierSnak(externalIdJson);
export { externalIdSnak };

// GeoShapeSnak
const geoShapeJson: WikidataGeoShapeSnak = {
    snaktype: 'value',
    property: 'P625',
    datavalue: {
        value: 'Data:Berlin.map',
        type: 'string'
    },
    datatype: 'geo-shape'
};

const geoShapeSnak = new GeoShapeSnak(geoShapeJson);
export { geoShapeSnak };

// GlobeCoordinateSnak
const globeCoordinateJson: WikidataGlobeCoordinateSnak = {
    snaktype: 'value',
    property: 'P625',
    datavalue: {
        value: {
            latitude: 52.518611,
            longitude: 13.408056,
            altitude: null,
            precision: 0.0002777777777777778,
            globe: 'http://www.wikidata.org/entity/Q2'
        },
        type: 'globecoordinate'
    },
    datatype: 'globe-coordinate'
};

const globeCoordinateSnak = new GlobeCoordinateSnak(globeCoordinateJson);
export { globeCoordinateSnak };

// MathSnak
const mathJson: WikidataMathSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: 'x^2',
        type: 'string'
    },
    datatype: 'math'
};

const mathSnak = new MathSnak(mathJson);
export { mathSnak };

// MonolingualTextSnak
const monolingualTextJson: WikidataMonolingualTextSnak = {
    snaktype: 'value',
    property: 'P1476',
    datavalue: {
        value: {
            text: 'The Shawshank Redemption',
            language: 'en'
        },
        type: 'monolingualtext'
    },
    datatype: 'monolingualtext'
};

const monolingualTextSnak = new MonolingualTextSnak(monolingualTextJson);
export { monolingualTextSnak };

// MusicalNotationSnak
const musicalNotationJson: WikidataMusicalNotationSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: "\\relative c' { \\key d \\minor f c f2 | a8 bes g a f2 | f4 c8 c f2 | a8 bes g a f2 | a4 bes8 bes c2 | d8 c bes d c4 c8 c | a g a bes c4 c | d8 c bes d c4 a | f8 e f g a4 g | a8 g a bes c d c bes | a4 g f2 }",
        type: 'string'
    },
    datatype: 'musical-notation'
};

const musicalNotationSnak = new MusicalNotationSnak(musicalNotationJson);
export { musicalNotationSnak };

// QuantitySnak
const quantityJson: WikidataQuantitySnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: {
            amount: '+42',
            unit: '1'
        },
        type: 'quantity'
    },
    datatype: 'quantity'
};

const quantitySnak = new QuantitySnak(quantityJson);
export { quantitySnak };

// StringSnak
const stringJson: WikidataStringSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: 'The Shawshank Redemption',
        type: 'string'
    },
    datatype: 'string'
};

const stringSnak = new StringSnak(stringJson);
export { stringSnak };

// TabularDataSnak
const tabularDataJson: WikidataTabularDataSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: 'Data:Example.csv',
        type: 'string'
    },
    datatype: 'tabular-data'
};

const tabularDataSnak = new TabularDataSnak(tabularDataJson);
export { tabularDataSnak };

// TimeSnak
const timeJson: WikidataTimeSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: {
            time: '+2001-12-31T00:00:00Z',
            timezone: 0,
            before: 0,
            after: 0,
            precision: 11,
            calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
        },
        type: 'time'
    },
    datatype: 'time'
};

const timeSnak = new TimeSnak(timeJson);
export { timeSnak };

// UrlSnak
const urlJson: WikidataURLSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: 'https://www.imdb.com/title/tt0111161/',
        type: 'string'
    },
    datatype: 'url'
};

const urlSnak = new URLSnak(urlJson);
export { urlSnak };

// WikibaseItemSnak
const wikibaseItemJson: WikidataWikibaseItemSnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: {
            'entity-type': 'item',
            'numeric-id': 123,
            id: 'Q123'
        },
        type: 'wikibase-entityid'
    },
    datatype: 'wikibase-item'
};

const wikibaseItemSnak = new WikibaseItemSnak(wikibaseItemJson);
export { wikibaseItemSnak };

// WikibasePropertySnak
const wikibasePropertyJson: WikidataWikibasePropertySnak = {
    snaktype: 'value',
    property: 'P123',
    datavalue: {
        value: {
            'entity-type': 'property',
            'numeric-id': 123,
            id: 'P123'
        },
        type: 'wikibase-entityid'
    },
    datatype: 'wikibase-property'
};

const wikibasePropertySnak = new WikibasePropertySnak(wikibasePropertyJson);
export { wikibasePropertySnak };
