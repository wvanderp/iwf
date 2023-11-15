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

            expect(snak.id).toEqual(`Q${wikibaseItemSnak.datavalue.value['numeric-id']}`);
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibaseItemSnak({
                snaktype: 'novalue',
                property: 'P150',
                datatype: 'wikibase-item' as const
            });

            expect(snak.id).toEqual(undefined);
        });
    });

    describe('set ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.id = 'Q1234';

            expect(snak.id).toEqual('Q1234');
            expect(snak.numericID).toEqual(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.id = undefined;

            expect(snak.id).toEqual(undefined);
            expect(snak.numericID).toEqual(undefined);
        });
    });

    describe('set numeric ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.numericID = 1234;

            expect(snak.id).toEqual('Q1234');
            expect(snak.numericID).toEqual(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            snak.numericID = undefined;

            expect(snak.id).toEqual(undefined);
            expect(snak.numericID).toEqual(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            expect(snak.toJSON()).toStrictEqual(wikibaseItemSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new WikibaseItemSnak(wikibaseItemSnak);
            const b = new WikibaseItemSnak(wikibaseItemSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new WikibaseItemSnak(wikibaseItemSnak);
            const b = new WikibaseItemSnak(wikibaseItemSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);
            const snak2 = new WikibaseItemSnak(wikibaseItemSnak);
            snak2.numericID = 2;

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('fromID', () => {
        it('should be true if the items are equal', () => {
            const snak = WikibaseItemSnak.fromID('P134', 'Q1234');

            expect(snak.id).toEqual('Q1234');
            expect(snak.property).toEqual('P134');
            expect(snak.hash).toEqual(undefined);
        });
    });
});
