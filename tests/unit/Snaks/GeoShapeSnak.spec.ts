import { GeoShapeSnak } from '../../../src';

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

    describe('no-value', () => {
        it('should serialize a no-value snak without datavalue', () => {
            const snak = new GeoShapeSnak({
                snaktype: 'novalue',
                property: 'P3896',
                datatype: 'geo-shape'
            } as unknown as ConstructorParameters<typeof GeoShapeSnak>[0]);

            expect(snak.toJSON()).toEqual({
                snaktype: 'novalue',
                property: 'P3896',
                datatype: 'geo-shape'
            });
        });
    });

    describe('commonsLink accessor', () => {
        it('should have the commonsLink property', () => {
            expect(Object.prototype.hasOwnProperty.call(GeoShapeSnak.prototype, 'commonsLink')).toBe(true);
        });

        it('should return the correct commonsLink for a value snak', () => {
            const snak = new GeoShapeSnak({
                snaktype: 'value',
                property: 'P3896',
                datatype: 'geo-shape',
                datavalue: { value: 'Data:Example.map', type: 'string' }
            } as unknown as ConstructorParameters<typeof GeoShapeSnak>[0]);

            expect(snak.commonsLink).toBe('https://commons.wikimedia.org/wiki/Data:Example.map');
        });
    });
});
