import { expect } from 'chai';
import { describe, it } from 'mocha';
import CommonsMediaSnak from '../../src/snaks/CommonsMediaSnak';

const commonsSnak = {
    snaktype: 'value' as const,
    property: 'P41',
    datavalue: {
        value: 'Flag of Berlin.svg',
        type: 'string'
    },
    datatype: 'commonsMedia' as const
};

describe('Commons Media Snak', () => {
    it('should return the right image link', () => {
        const snak = new CommonsMediaSnak(commonsSnak);

        expect(snak.imageLink).to.equal('https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag of Berlin.svg');
    });

    it('should return the right commons link', () => {
        const snak = new CommonsMediaSnak(commonsSnak);

        expect(snak.commonsLink).to.equal('https://commons.wikimedia.org/wiki/File:Flag of Berlin.svg');
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new CommonsMediaSnak(commonsSnak);

            expect(snak.toJSON()).to.deep.equal(commonsSnak);
        });
    });
});
