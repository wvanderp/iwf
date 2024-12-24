import EntitySchemaSnak from '../../../src/snaks/EntitySchemaSnak';

const EntitySnak = {
    snaktype: 'value' as const,
    property: 'P123',
    datavalue: {
        value: {
            id: 'E123456',
            'entity-type': 'entity-schema' as const
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'entity-schema' as const
};

describe('EntitySchemaSnak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new EntitySchemaSnak(EntitySnak);

            expect(snak.toJSON()).toStrictEqual(EntitySnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new EntitySchemaSnak(EntitySnak);
            const b = new EntitySchemaSnak(EntitySnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new EntitySchemaSnak(EntitySnak);
            const b = new EntitySchemaSnak(EntitySnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new EntitySchemaSnak(EntitySnak);
            const snak2 = new EntitySchemaSnak(EntitySnak);
            snak2.id = 'E654321';

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('fromID', () => {
        it('should create a snak from an ID', () => {
            const snak = EntitySchemaSnak.fromID('P2013', 'E987654');

            expect(snak.id).toEqual('E987654');
            expect(snak.property).toEqual('P2013');
        });
    });

    describe('id setter', () => {
        it('should set snaktype to novalue when id is undefined', () => {
            const snak = new EntitySchemaSnak(EntitySnak);
            snak.id = undefined;
            expect(snak.snaktype).toBe('novalue');
            expect(snak.id).toBeUndefined();
        });

        it('should update the id correctly when set to a new E value', () => {
            const snak = new EntitySchemaSnak(EntitySnak);
            snak.id = 'E999999';
            expect(snak.id).toBe('E999999');
        });
    });

    describe('numericID property', () => {
        it('should return the correct numericID', () => {
            const snak = new EntitySchemaSnak(EntitySnak);
            expect(snak.numericID).toBe(123456);
        });

        it('should set the numericID correctly', () => {
            const snak = new EntitySchemaSnak(EntitySnak);
            snak.numericID = 999999;
            expect(snak.numericID).toBe(999999);
        });
    });
});
