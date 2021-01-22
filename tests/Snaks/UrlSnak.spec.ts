import { expect } from 'chai';
import { describe, it } from 'mocha';
import { UrlSnak } from '../../src';

const urlSnak = {
    snaktype: 'value' as const,
    property: 'P854',
    datavalue: {
        value: 'http://www.berlin.de/special/immobilien-und-wohnen/stadtteile/',
        type: 'string' as const
    },
    datatype: 'url' as const
};

describe('URL Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new UrlSnak(urlSnak);

            expect(snak.toJSON()).to.deep.equal(urlSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new UrlSnak(urlSnak);

            expect(UrlSnak.equals(snak, snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new UrlSnak(urlSnak);
            const snak2 = new UrlSnak(urlSnak);
            snak2.value = 'http://wikidata.org/';

            expect(UrlSnak.equals(snak, snak2)).to.be.false;
        });
    });
});
