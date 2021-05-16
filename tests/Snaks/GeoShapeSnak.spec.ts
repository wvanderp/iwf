import { expect } from 'chai';
import { describe, it } from 'mocha';
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

        expect(snak.commonsLink).to.equal('https://commons.wikimedia.org/wiki/Data:Berlin.map');
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new GeoShapeSnak(geoShapeSnak);

            expect(snak.toJSON()).to.deep.equal(geoShapeSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new GeoShapeSnak(geoShapeSnak);

            expect(snak.equals(snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new GeoShapeSnak(geoShapeSnak);
            const snak2 = new GeoShapeSnak(geoShapeSnak);
            snak2.fileName = 'Data:japan.map';

            expect(snak.equals(snak2)).to.be.false;
        });
    });
});
