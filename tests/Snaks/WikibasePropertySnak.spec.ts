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

            expect(snak.id).toEqual(`P${wikibasePropertySnak.datavalue.value['numeric-id']}`);
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibasePropertySnak({
                snaktype: 'novalue',
                property: 'P150',
                datatype: 'wikibase-property' as const
            });

            expect(snak.id).toEqual(undefined);
        });
    });

    describe('set ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.id = 'P1234';

            expect(snak.id).toEqual('P1234');
            expect(snak.numericID).toEqual(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.id = undefined;

            expect(snak.id).toEqual(undefined);
            expect(snak.numericID).toEqual(undefined);
        });
    });

    describe('set numeric ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.numericID = 1234;

            expect(snak.id).toEqual('P1234');
            expect(snak.numericID).toEqual(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            snak.numericID = undefined;

            expect(snak.id).toEqual(undefined);
            expect(snak.numericID).toEqual(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);

            expect(snak.toJSON()).toStrictEqual(wikibasePropertySnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new WikibasePropertySnak(wikibasePropertySnak);
            const b = new WikibasePropertySnak(wikibasePropertySnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new WikibasePropertySnak(wikibasePropertySnak);
            const b = new WikibasePropertySnak(wikibasePropertySnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new WikibasePropertySnak(wikibasePropertySnak);
            const snak2 = new WikibasePropertySnak(wikibasePropertySnak);
            snak2.numericID = 2;

            expect(snak.equals(snak2)).toBe(false);
        });
    });
});
