import { expect } from 'chai';
import { describe, it } from 'mocha';
import MonolingualTextSnak from '../../src/snaks/MonolingualTextSnak';

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
});
