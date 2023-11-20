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
} from '../../../../src';

// CommonsMediaSnak
const commonsMediaJson: WikidataCommonsMediaSnak = {
    snaktype: 'value',
    property: 'P18',
    datavalue: {
        value: 'Douglas adams portrait cropped.jpg',
        type: 'string'
    },
    datatype: 'commonsMedia'
};

const commonsMediaSnak = new CommonsMediaSnak(commonsMediaJson);
export { commonsMediaSnak as exampleCommonsMediaSnak };

// ExternalIdSnak
const externalIdJson: WikidataExternalIdentifierSnak = {
    snaktype: 'value',
    property: 'P3417',
    datavalue: {
        value: 'C-Major-Scale',
        type: 'string'
    },
    datatype: 'external-id'
};

const externalIdSnak = new ExternalIdentifierSnak(externalIdJson);
export { externalIdSnak as exampleExternalIdSnak };

// GeoShapeSnak
const geoShapeJson: WikidataGeoShapeSnak = {
    snaktype: 'value',
    property: 'P3896',
    datavalue: {
        value: 'Data:Berlin.map',
        type: 'string'
    },
    datatype: 'geo-shape'
};

const geoShapeSnak = new GeoShapeSnak(geoShapeJson);
export { geoShapeSnak as exampleGeoShapeSnak };

// GlobeCoordinateSnak
const globeCoordinateJson: WikidataGlobeCoordinateSnak = {
    snaktype: 'value',
    property: 'P1333',
    datavalue: {
        value: {
            latitude: 40.496045,
            longitude: -74.247195,
            altitude: null,
            precision: 1e-6,
            globe: 'http://www.wikidata.org/entity/Q2'
        },
        type: 'globecoordinate'
    },
    datatype: 'globe-coordinate'
};

const globeCoordinateSnak = new GlobeCoordinateSnak(globeCoordinateJson);
export { globeCoordinateSnak as exampleGlobeCoordinateSnak };

// MathSnak
const mathJson: WikidataMathSnak = {
    snaktype: 'value',
    property: 'P2534',
    datavalue: {
        value: 'a^2+b^2=c^2',
        type: 'string'
    },
    datatype: 'math'
};

const mathSnak = new MathSnak(mathJson);
export { mathSnak as exampleMathSnak };

// MonolingualTextSnak
const monolingualTextJson: WikidataMonolingualTextSnak = {
    snaktype: 'value',
    property: 'P1813',
    datavalue: {
        value: {
            text: 'formula',
            language: 'en'
        },
        type: 'monolingualtext'
    },
    datatype: 'monolingualtext'
};

const monolingualTextSnak = new MonolingualTextSnak(monolingualTextJson);
export { monolingualTextSnak as exampleMonolingualTextSnak };

// MusicalNotationSnak
const musicalNotationJson: WikidataMusicalNotationSnak = {
    snaktype: 'value',
    property: 'P6883',
    datavalue: {
        value: "\\relative c' {c d e f g a b c}",
        type: 'string'
    },
    datatype: 'musical-notation'
};

const musicalNotationSnak = new MusicalNotationSnak(musicalNotationJson);
export { musicalNotationSnak as exampleMusicalNotationSnak };

// QuantitySnak
const quantityJson: WikidataQuantitySnak = {
    snaktype: 'value',
    property: 'P2527',
    datavalue: {
        value: {
            amount: '+9.1',
            unit: '1'
        },
        type: 'quantity'
    },
    datatype: 'quantity'
};

const quantitySnak = new QuantitySnak(quantityJson);
export { quantitySnak as exampleQuantitySnak };

// StringSnak
const stringJson: WikidataStringSnak = {
    snaktype: 'value',
    property: 'P373',
    datavalue: {
        value: '2011 T\u014Dhoku earthquake',
        type: 'string'
    },
    datatype: 'string'
};

const stringSnak = new StringSnak(stringJson);
export { stringSnak as exampleStringSnak };

// TabularDataSnak
const tabularDataJson: WikidataTabularDataSnak = {
    snaktype: 'value',
    property: 'P4150',
    datavalue: {
        value: 'Data:Ncei.noaa.gov/weather/New York City.tab',
        type: 'string'
    },
    datatype: 'tabular-data'
};

const tabularDataSnak = new TabularDataSnak(tabularDataJson);
export { tabularDataSnak as exampleTabularDataSnak };

// TimeSnak
const timeJson: WikidataTimeSnak = {
    snaktype: 'value',
    property: 'P580',
    datavalue: {
        value: {
            time: '+2008-04-17T00:00:00Z',
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
export { timeSnak as exampleTimeSnak };

// UrlSnak
const urlJson: WikidataURLSnak = {
    snaktype: 'value',
    property: 'P854',
    datavalue: {
        value: 'http://id.loc.gov/authorities/classification/F128-F128.9',
        type: 'string'
    },
    datatype: 'url'
};

const urlSnak = new URLSnak(urlJson);
export { urlSnak as exampleUrlSnak };

// WikibaseItemSnak
const wikibaseItemJson: WikidataWikibaseItemSnak = {
    snaktype: 'value',
    property: 'P1855',
    datavalue: {
        value: {
            'entity-type': 'item',
            'numeric-id': 11518,
            id: 'Q11518'
        },
        type: 'wikibase-entityid'
    },
    datatype: 'wikibase-item'
};

const wikibaseItemSnak = new WikibaseItemSnak(wikibaseItemJson);
export { wikibaseItemSnak as exampleWikibaseItemSnak };

// WikibasePropertySnak
const wikibasePropertyJson: WikidataWikibasePropertySnak = {
    snaktype: 'value',
    property: 'P2306',
    datavalue: {
        value: {
            'entity-type': 'property',
            'numeric-id': 31,
            id: 'P31'
        },
        type: 'wikibase-entityid'
    },
    datatype: 'wikibase-property'
};

const wikibasePropertySnak = new WikibasePropertySnak(wikibasePropertyJson);
export { wikibasePropertySnak as exampleWikibasePropertySnak };
