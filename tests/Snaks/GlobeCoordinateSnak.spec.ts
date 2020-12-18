import { expect } from 'chai';
import { describe, it } from 'mocha';
import GlobeCoordinateSnak from '../../src/snaks/GlobeCoordinateSnak';

const globeCoordinateSnak = {
    snaktype: 'value' as const,
    property: 'P625',
    datavalue: {
        value: {
            latitude: 52.516666666667,
            longitude: 13.383333333333,
            altitude: null,
            precision: 0.016666666666667,
            globe: 'http://www.wikidata.org/entity/Q2'
        },
        type: 'globecoordinate' as const
    },
    datatype: 'globe-coordinate' as const
};

describe('globe Coordinate Snak', () => {
    it('should Ingest normal snak object', () => {
        // eslint-disable-next-line no-new
        new GlobeCoordinateSnak(globeCoordinateSnak);
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new GlobeCoordinateSnak(globeCoordinateSnak);

            expect(snak.toJSON()).to.deep.equal(globeCoordinateSnak);
        });
    });
});
