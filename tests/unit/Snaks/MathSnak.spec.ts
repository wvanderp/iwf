import { MathSnak } from '../../../src';

const mathSnak = {
    snaktype: 'value' as const,
    property: 'P2534',
    datavalue: {
        value: String.raw`k = \frac{R}{N_\text{A}}`,
        type: 'string' as const
    },
    datatype: 'math' as const
};

describe('Math Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new MathSnak(mathSnak);

            expect(snak.toJSON()).toStrictEqual(mathSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new MathSnak(mathSnak);
            const b = new MathSnak(mathSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new MathSnak(mathSnak);
            const b = new MathSnak(mathSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new MathSnak(mathSnak);
            const snak2 = new MathSnak(mathSnak);
            snak2.value = 'y = ax + b';

            expect(snak.equals(snak2)).toBe(false);
        });
    });
});
