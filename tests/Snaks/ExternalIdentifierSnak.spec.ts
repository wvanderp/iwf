import { expect } from 'chai';
import { describe, it } from 'mocha';
import ExternalIdentifierSnak from '../../src/snaks/ExternalIdentifierSnak';

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
});
