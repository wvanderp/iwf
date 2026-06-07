import { StringSnak } from '../../../src';

const stringSnak = {
    snaktype: 'value' as const,
    property: 'P958',
    datavalue: {
        value: 'Artikel 1 (2)',
        type: 'string' as const
    },
    datatype: 'string' as const
};

describe('String Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new StringSnak(stringSnak);

            expect(snak.toJSON()).toStrictEqual(stringSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new StringSnak(stringSnak);
            const b = new StringSnak(stringSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new StringSnak(stringSnak);
            const b = new StringSnak(stringSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new StringSnak(stringSnak);
            const snak2 = new StringSnak(stringSnak);
            snak2.value = 'string';

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('no-value', () => {
        it('should serialize a no-value snak without datavalue', () => {
            const snak = new StringSnak({
                snaktype: 'novalue',
                property: 'P1545',
                datatype: 'string'
            } as unknown as ConstructorParameters<typeof StringSnak>[0]);

            expect(snak.toJSON()).toEqual({
                snaktype: 'novalue',
                property: 'P1545',
                datatype: 'string'
            });
        });
    });

    describe('fromString', () => {
        it('should create a snak and return the correct value', () => {
            expect(StringSnak.fromString('P1545', '1').value).toBe('1');
        });
    });
});
