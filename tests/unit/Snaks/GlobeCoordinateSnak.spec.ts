import { GlobeCoordinateSnak } from '../../../src';

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
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new GlobeCoordinateSnak(globeCoordinateSnak);

            expect(snak.toJSON()).toStrictEqual(globeCoordinateSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new GlobeCoordinateSnak(globeCoordinateSnak);
            const b = new GlobeCoordinateSnak(globeCoordinateSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new GlobeCoordinateSnak(globeCoordinateSnak);
            const b = new GlobeCoordinateSnak(globeCoordinateSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new GlobeCoordinateSnak(globeCoordinateSnak);
            const snak2 = new GlobeCoordinateSnak(globeCoordinateSnak);
            snak2.longitude = 4;

            expect(snak.equals(snak2)).toBe(false);
        });
    });
});
