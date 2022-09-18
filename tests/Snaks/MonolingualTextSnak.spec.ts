import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MonolingualTextSnak } from '../../src';

const monolingualTextSnak = {
    snaktype: 'value' as const,
    property: 'P1476',
    datavalue: {
        value: {
            text: 'Zum Wettstreit um den h\u00F6chsten Gipfel Berlins',
            language: 'de' as const
        },
        type: 'monolingualtext' as const
    },
    datatype: 'monolingualtext' as const
};

describe('Monolingual Text Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new MonolingualTextSnak(monolingualTextSnak);

            expect(snak.toJSON()).to.deep.equal(monolingualTextSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new MonolingualTextSnak(monolingualTextSnak);
            const b = new MonolingualTextSnak(monolingualTextSnak);

            expect(a.equals(b)).to.be.true;
        });

        it('should be false if the property changes', () => {
            const a = new MonolingualTextSnak(monolingualTextSnak);
            const b = new MonolingualTextSnak(monolingualTextSnak);

            b.property = 'P42';

            expect(a.equals(b)).to.be.false;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new MonolingualTextSnak(monolingualTextSnak);
            const snak2 = new MonolingualTextSnak(monolingualTextSnak);
            snak2.language = 'EN';

            expect(snak.equals(snak2)).to.be.false;
        });
    });

    describe('fromString', () => {
        it('should create a snak from a string', () => {
            const snak = MonolingualTextSnak.fromString('P1476', 'de', 'Zum Wettstreit um den h\u00F6chsten Gipfel Berlins');

            expect(snak.toJSON()).to.deep.equal(monolingualTextSnak);
        });
    });
});
