import { expect } from 'chai';
import { describe, it } from 'mocha';
import GeoShapeSnak from '../../src/snaks/GeoShapeSnak';

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
});
