import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MathSnak } from '../../src';

const mathSnak = {
    snaktype: 'value' as const,
    property: 'P2534',
    datavalue: {
        value: 'k = \\frac{R}{N_\\text{A}}',
        type: 'string' as const
    },
    datatype: 'math' as const
};

describe('Math Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new MathSnak(mathSnak);

            expect(snak.toJSON()).to.deep.equal(mathSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new MathSnak(mathSnak);

            expect(snak.equals(snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new MathSnak(mathSnak);
            const snak2 = new MathSnak(mathSnak);
            snak2.value = 'y = ax + b';

            expect(snak.equals(snak2)).to.be.false;
        });
    });
});
