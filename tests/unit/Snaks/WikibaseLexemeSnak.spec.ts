import { WikibaseLexemeSnak } from '../../../src';

const wikibaseLexemeSnak = {
    snaktype: 'value' as const,
    property: 'P5185',
    datavalue: {
        value: {
            'entity-type': 'lexeme' as const,
            'numeric-id': 12345,
            id: 'L12345'
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'wikibase-lexeme' as const
};

describe('Wikibase Lexeme Snak', () => {
    describe('get ID', () => {
        it('should return the id including the L when there is a ID', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            expect(snak.id).toEqual(`L${wikibaseLexemeSnak.datavalue.value['numeric-id']}`);
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibaseLexemeSnak({
                snaktype: 'novalue',
                property: 'P5185',
                datatype: 'wikibase-lexeme' as const
            });

            expect(snak.id).toEqual(undefined);
        });
    });

    describe('set ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            snak.id = 'L1234';

            expect(snak.id).toEqual('L1234');
            expect(snak.numericID).toEqual(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            snak.id = undefined;

            expect(snak.id).toEqual(undefined);
            expect(snak.numericID).toEqual(undefined);
        });
    });

    describe('set numeric ID', () => {
        it('should set both the id as numericID', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            snak.numericID = 1234;

            expect(snak.id).toEqual('L1234');
            expect(snak.numericID).toEqual(1234);
        });

        it('should set both the id as numericID to undefined', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            snak.numericID = undefined;

            expect(snak.id).toEqual(undefined);
            expect(snak.numericID).toEqual(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            expect(snak.toJSON()).toStrictEqual(wikibaseLexemeSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new WikibaseLexemeSnak(wikibaseLexemeSnak);
            const b = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new WikibaseLexemeSnak(wikibaseLexemeSnak);
            const b = new WikibaseLexemeSnak(wikibaseLexemeSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new WikibaseLexemeSnak(wikibaseLexemeSnak);
            const snak2 = new WikibaseLexemeSnak(wikibaseLexemeSnak);
            snak2.numericID = 2;

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('fromData', () => {
        it('should create a snak from property and lexeme ID', () => {
            const snak = WikibaseLexemeSnak.fromData('P5185', 'L1234');

            expect(snak.property).toEqual('P5185');
            expect(snak.id).toEqual('L1234');
            expect(snak.numericID).toEqual(1234);
        });
    });
});
