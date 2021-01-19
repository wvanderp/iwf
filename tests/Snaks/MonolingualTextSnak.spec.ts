import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MonolingualTextSnak } from '../../src';

const monolingualTextSnak = {
    snaktype: 'value' as const,
    property: 'P1476',
    datavalue: {
        value: {
            text: 'Zum Wettstreit um den h\u00F6chsten Gipfel Berlins',
            language: 'de'
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
            const snak = new MonolingualTextSnak(monolingualTextSnak);

            expect(MonolingualTextSnak.equals(snak, snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new MonolingualTextSnak(monolingualTextSnak);
            const snak2 = new MonolingualTextSnak(monolingualTextSnak);
            snak2.language = 'EN';

            expect(MonolingualTextSnak.equals(snak, snak2)).to.be.false;
        });
    });
});
