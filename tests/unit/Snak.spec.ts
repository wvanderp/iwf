// imported WikiBaseItemSnak because Snak is abstract
import { WikibaseItemSnak } from '../../src';

describe('Snak', () => {
    describe('constructor', () => {
        it('should reject incorrect property ids', () => {
            // @ts-expect-error - we want to test the error handling
            expect(() => WikibaseItemSnak.fromID('property1', 'Q2221')).toThrow();
        });
    });

    describe('internalID', () => {
        it('should hash the json', () => {
            const snak = WikibaseItemSnak.fromID('P1', 'Q1');
            expect(snak.internalID).toEqual('d87816b2023818e42517e16ad2332b1af4893db28a991d62a528c502147895ed');
        });

        it('should not change when the snak changes', () => {
            const snak = WikibaseItemSnak.fromID('P1', 'Q1');
            const id = snak.internalID;
            snak.property = 'P2';
            expect(snak.internalID).toEqual(id);
        });
    });
});
