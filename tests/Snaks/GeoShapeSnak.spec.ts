import { GeoShapeSnak } from '../../src';

const geoShapeSnak = {
    snaktype: 'value' as const,
    property: 'P3896',
    datavalue: {
        value: 'Data:Berlin.map',
        type: 'string' as const
    },
    datatype: 'geo-shape' as const
};

describe('Commons Media Snak', () => {
    it('should return the right commons link', () => {
        const snak = new GeoShapeSnak(geoShapeSnak);

        expect(snak.commonsLink).toEqual('https://commons.wikimedia.org/wiki/Data:Berlin.map');
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new GeoShapeSnak(geoShapeSnak);

            expect(snak.toJSON()).toStrictEqual(geoShapeSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new GeoShapeSnak(geoShapeSnak);
            const b = new GeoShapeSnak(geoShapeSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new GeoShapeSnak(geoShapeSnak);
            const b = new GeoShapeSnak(geoShapeSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new GeoShapeSnak(geoShapeSnak);
            const snak2 = new GeoShapeSnak(geoShapeSnak);
            snak2.fileName = 'Data:japan.map';

            expect(snak.equals(snak2)).toBe(false);
        });
    });
});
