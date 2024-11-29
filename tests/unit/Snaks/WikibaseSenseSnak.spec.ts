import { WikibaseSenseSnak } from '../../../src';

const wikibaseSenseSnak = {
    snaktype: 'value' as const,
    property: 'P1963',
    datavalue: {
        value: {
            'entity-type': 'sense' as const,
            id: 'L123-S456'
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'wikibase-sense' as const
};

describe('Wikibase Sense Snak', () => {
    describe('get ID', () => {
        it('should return the id in L{number}-S{number} format when there is a value', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            expect(snak.id).toEqual('L123-S456');
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibaseSenseSnak({
                snaktype: 'novalue',
                property: 'P150',
                datatype: 'wikibase-sense' as const
            });
            expect(snak.id).toEqual(undefined);
        });
    });

    describe('set ID', () => {
        it('should set lexemeId and senseId from combined ID', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            snak.id = 'L789-S101';
            expect(snak.lexemeId).toEqual(789);
            expect(snak.senseId).toEqual(101);
        });

        it('should set both ids to undefined when id is undefined', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            snak.id = undefined;
            expect(snak.lexemeId).toEqual(undefined);
            expect(snak.senseId).toEqual(undefined);
        });
    });

    describe('lexemeId', () => {
        it('should get and set lexemeId', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            snak.lexemeId = 789;
            expect(snak.lexemeId).toEqual(789);
            expect(snak.id).toEqual('L789-S456');
        });

        it('should handle undefined lexemeId', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            snak.lexemeId = undefined;
            expect(snak.lexemeId).toEqual(undefined);
        });
    });

    describe('senseId', () => {
        it('should get and set senseId', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            snak.senseId = 789;
            expect(snak.senseId).toEqual(789);
            expect(snak.id).toEqual('L123-S789');
        });

        it('should handle undefined senseId', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            snak.senseId = undefined;
            expect(snak.senseId).toEqual(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibaseSenseSnak(wikibaseSenseSnak);
            expect(snak.toJSON()).toStrictEqual(wikibaseSenseSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new WikibaseSenseSnak(wikibaseSenseSnak);
            const b = new WikibaseSenseSnak(wikibaseSenseSnak);
            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new WikibaseSenseSnak(wikibaseSenseSnak);
            const b = new WikibaseSenseSnak(wikibaseSenseSnak);
            b.property = 'P42';
            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the lexemeId changes', () => {
            const a = new WikibaseSenseSnak(wikibaseSenseSnak);
            const b = new WikibaseSenseSnak(wikibaseSenseSnak);
            b.lexemeId = 999;
            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the senseId changes', () => {
            const a = new WikibaseSenseSnak(wikibaseSenseSnak);
            const b = new WikibaseSenseSnak(wikibaseSenseSnak);
            b.senseId = 999;
            expect(a.equals(b)).toBe(false);
        });
    });
});
