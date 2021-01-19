import { expect } from 'chai';
import { describe, it } from 'mocha';
import { WikibaseItemSnak } from '../../src';

const wikibaseItemSnak = {
    snaktype: 'value' as const,
    property: 'P150',
    datavalue: {
        value: {
            'entity-type': 'item' as const,
            'numeric-id': 158893,
            id: 'Q158893'
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'wikibase-item' as const
};

describe('Wikibase Item Snak', () => {
    describe('get ID', () => {
        it('should return the id including the Q when there is a ID', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            expect(snak.id).to.equal(`Q${wikibaseItemSnak.datavalue.value['numeric-id']}`);
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibaseItemSnak({
                snaktype: 'novalue',
                property: 'P150',
                datatype: 'wikibase-item' as const
            });

            expect(snak.id).to.equal(undefined);
        });
    });

    describe('set ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.id = 'Q1234';

            expect(snak.id).to.equal('Q1234');
            expect(snak.numericID).to.equal(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.id = undefined;

            expect(snak.id).to.equal(undefined);
            expect(snak.numericID).to.equal(undefined);
        });
    });

    describe('set numeric ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.numericID = 1234;

            expect(snak.id).to.equal('Q1234');
            expect(snak.numericID).to.equal(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.numericID = undefined;

            expect(snak.id).to.equal(undefined);
            expect(snak.numericID).to.equal(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            expect(snak.toJSON()).to.deep.equal(wikibaseItemSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            expect(WikibaseItemSnak.equals(snak, snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);
            const snak2 = new WikibaseItemSnak(wikibaseItemSnak);
            snak2.numericID = 2;

            expect(WikibaseItemSnak.equals(snak, snak2)).to.be.false;
        });
    });
});
