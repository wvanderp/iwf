import { expect } from 'chai';
import { describe, it } from 'mocha';
import { WikibasePropertySnak } from '../../src';

const wikibasePropertySnak = {
    snaktype: 'value' as const,
    property: 'P1963',
    datavalue: {
        value: {
            'entity-type': 'property' as const,
            'numeric-id': 18,
            id: 'P18'
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'wikibase-property' as const
};

describe('Wikibase Item Snak', () => {
    describe('get ID', () => {
        it('should return the id including the P when there is a ID', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            expect(snak.id).to.equal(`P${wikibasePropertySnak.datavalue.value['numeric-id']}`);
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibasePropertySnak({
                snaktype: 'novalue',
                property: 'P150',
                datatype: 'wikibase-property' as const
            });

            expect(snak.id).to.equal(undefined);
        });
    });

    describe('set ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.id = 'P1234';

            expect(snak.id).to.equal('P1234');
            expect(snak.numericID).to.equal(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.id = undefined;

            expect(snak.id).to.equal(undefined);
            expect(snak.numericID).to.equal(undefined);
        });
    });

    describe('set numeric ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.numericID = 1234;

            expect(snak.id).to.equal('P1234');
            expect(snak.numericID).to.equal(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.numericID = undefined;

            expect(snak.id).to.equal(undefined);
            expect(snak.numericID).to.equal(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            expect(snak.toJSON()).to.deep.equal(wikibasePropertySnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            expect(WikibasePropertySnak.equals(snak, snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);
            const snak2 = new WikibasePropertySnak(wikibasePropertySnak);
            snak2.numericID = 2;

            expect(WikibasePropertySnak.equals(snak, snak2)).to.be.false;
        });
    });
});
