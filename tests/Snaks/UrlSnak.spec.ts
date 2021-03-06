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

            expect(snak.equals(snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new UrlSnak(urlSnak);
            const snak2 = new UrlSnak(urlSnak);
            snak2.value = 'http://wikidata.org/';

            expect(snak.equals(snak2)).to.be.false;
        });
    });

    describe('fromURL', () => {
        it('should create a snak from an ID', () => {
            const snak = UrlSnak.fromURL('P854', 'https://www.typescriptlang.org/');

            expect(snak.property).to.equal('P854');
            expect(snak.url).to.equal('https://www.typescriptlang.org/');
        });
    });
});
