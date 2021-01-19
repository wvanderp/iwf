import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ExternalIdentifierSnak } from '../../src';

const ExternalSnak = {
    snaktype: 'value' as const,
    property: 'P998',
    datavalue: {
        value: 'World/Deutsch/Regional/Europa/Deutschland/Berlin/',
        type: 'string'
    },
    datatype: 'external-id' as const
};

describe('External Identifier Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new ExternalIdentifierSnak(ExternalSnak);

            expect(snak.toJSON()).to.deep.equal(ExternalSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new ExternalIdentifierSnak(ExternalSnak);

            expect(ExternalIdentifierSnak.equals(snak, snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new ExternalIdentifierSnak(ExternalSnak);
            const snak2 = new ExternalIdentifierSnak(ExternalSnak);
            snak2.id = '1888155769085727880005';

            expect(ExternalIdentifierSnak.equals(snak, snak2)).to.be.false;
        });
    });
});
