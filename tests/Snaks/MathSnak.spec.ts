import { expect } from 'chai';
import { describe, it } from 'mocha';
import MathSnak from '../../src/snaks/MathSnak';

const mathSnak = {
    snaktype: 'value' as const,
    property: 'P2534',
    datavalue: {
        value: 'k = \\frac{R}{N_\\text{A}}',
        type: 'string'
    },
    datatype: 'math' as const
};

describe('Math Snak', () => {
    it('should Ingest normal snak object', () => {
        // eslint-disable-next-line no-new
        new MathSnak(mathSnak);
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new MathSnak(mathSnak);

            expect(snak.toJSON()).to.deep.equal(mathSnak);
        });
    });
});
