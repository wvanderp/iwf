import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StringSnak } from '../../src';

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

            expect(snak.toJSON()).to.deep.equal(stringSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new StringSnak(stringSnak);
            const b = new StringSnak(stringSnak);

            expect(a.equals(b)).to.be.true;
        });

        it('should be false if the property changes', () => {
            const a = new StringSnak(stringSnak);
            const b = new StringSnak(stringSnak);

            b.property = 'P42';

            expect(a.equals(b)).to.be.false;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new StringSnak(stringSnak);
            const snak2 = new StringSnak(stringSnak);
            snak2.value = 'string';

            expect(snak.equals(snak2)).to.be.false;
        });
    });
});
