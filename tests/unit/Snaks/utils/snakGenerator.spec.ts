import type { Snaks as WikidataSnaks } from '@wvanderp/wikibase-datamodel-types';

import Snak from '../../../../src/Snak';
import snakGenerator from '../../../../src/utils/snakGenerator';
import {
    exampleCommonsMediaSnak,
    exampleEntitySchemaSnak,
    exampleExternalIdSnak,
    exampleGeoShapeSnak,
    exampleGlobeCoordinateSnak,
    exampleMathSnak,
    exampleMonolingualTextSnak,
    exampleMusicalNotationSnak,
    exampleQuantitySnak,
    exampleStringSnak,
    exampleTabularDataSnak,
    exampleTimeSnak,
    exampleUrlSnak,
    exampleWikibaseFormSnak,
    exampleWikibaseItemSnak,
    exampleWikibaseLexemeSnak,
    exampleWikibasePropertySnak,
    exampleWikibaseSenseSnak
} from '../../testUtils/examples/snaks';

const unknownSnak = {
    snaktype: 'value' as const,
    property: 'P582',
    datavalue: {},
    datatype: 'unknown' as const
};

type Datatype = NonNullable<WikidataSnaks['datatype']>;

// Typed as a Record so that tsc fails when the datamodel gains a datatype that is not covered here.
const examplesByDatatype: Record<Datatype, Snak> = {
    commonsMedia: exampleCommonsMediaSnak,
    'entity-schema': exampleEntitySchemaSnak,
    'external-id': exampleExternalIdSnak,
    'geo-shape': exampleGeoShapeSnak,
    'globe-coordinate': exampleGlobeCoordinateSnak,
    math: exampleMathSnak,
    monolingualtext: exampleMonolingualTextSnak,
    'musical-notation': exampleMusicalNotationSnak,
    quantity: exampleQuantitySnak,
    string: exampleStringSnak,
    'tabular-data': exampleTabularDataSnak,
    time: exampleTimeSnak,
    url: exampleUrlSnak,
    'wikibase-form': exampleWikibaseFormSnak,
    'wikibase-item': exampleWikibaseItemSnak,
    'wikibase-lexeme': exampleWikibaseLexemeSnak,
    'wikibase-property': exampleWikibasePropertySnak,
    'wikibase-sense': exampleWikibaseSenseSnak
};

describe('snakGenerator', () => {
    it('should throw when unexpected snak type is found', () => {
        expect(() => snakGenerator(unknownSnak)).toThrow();
    });

    for (const [datatype, example] of Object.entries(examplesByDatatype)) {
        describe(`datatype ${datatype}`, () => {
            it(`should create a ${example.constructor.name}`, () => {
                const snak = snakGenerator(example.toJSON());

                expect(snak).toBeInstanceOf(example.constructor);
                expect(snak.datatype).toBe(datatype);
            });

            it('should return the same JSON as was ingested', () => {
                const json = example.toJSON();

                expect(snakGenerator(json).toJSON()).toStrictEqual(json);
            });

            for (const snaktype of ['novalue', 'somevalue'] as const) {
                it(`should handle a ${snaktype} snak without datavalue`, () => {
                    const json = { snaktype, property: example.property, datatype };
                    const snak = snakGenerator(json);

                    expect(snak).toBeInstanceOf(example.constructor);
                    expect(snak.hasValue).toBe(false);
                    expect(snak.toJSON()).toStrictEqual(json);
                });
            }
        });
    }
});
