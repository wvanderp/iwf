import { ExternalIdentifierSnak } from '../../../src';

const ExternalSnak = {
    snaktype: 'value' as const,
    property: 'P998',
    datavalue: {
        value: 'World/Deutsch/Regional/Europa/Deutschland/Berlin/',
        type: 'string' as const
    },
    datatype: 'external-id' as const
};

describe('External Identifier Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new ExternalIdentifierSnak(ExternalSnak);

            expect(snak.toJSON()).toStrictEqual(ExternalSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new ExternalIdentifierSnak(ExternalSnak);
            const b = new ExternalIdentifierSnak(ExternalSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new ExternalIdentifierSnak(ExternalSnak);
            const b = new ExternalIdentifierSnak(ExternalSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new ExternalIdentifierSnak(ExternalSnak);
            const snak2 = new ExternalIdentifierSnak(ExternalSnak);
            snak2.id = '1888155769085727880005';

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('fromID', () => {
        it('should create a snak from an ID', () => {
            const snak = ExternalIdentifierSnak.fromID('P2013', 'airbus');

            expect(snak.id).toEqual('airbus');
            expect(snak.property).toEqual('P2013');
        });
    });
});
