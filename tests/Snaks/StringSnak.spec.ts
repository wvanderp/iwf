import { expect } from 'chai';
import { describe, it } from 'mocha';
import StringSnak from '../../src/snaks/StringSnak';

const stringSnak = {
    snaktype: 'value' as const,
    property: 'P958',
    datavalue: {
        value: 'Artikel 1 (2)',
        type: 'string'
    },
    datatype: 'string' as const
};

describe('String Snak', () => {
    it('should Ingest normal snak object', () => {
        // eslint-disable-next-line no-new
        new StringSnak(stringSnak);
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new StringSnak(stringSnak);

            expect(snak.toJSON()).to.deep.equal(stringSnak);
        });
    });
});
