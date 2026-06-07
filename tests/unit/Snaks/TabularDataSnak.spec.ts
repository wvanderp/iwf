import { TabularDataSnak } from '../../../src';

const tabularDataSnak = {
    snaktype: 'value' as const,
    property: 'P4150',
    datavalue: {
        value: 'Data:Ncei.noaa.gov/weather/New York City.tab',
        type: 'string' as const
    },
    datatype: 'tabular-data' as const
};

describe('Tabular Data Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new TabularDataSnak(tabularDataSnak);

            expect(snak.toJSON()).toStrictEqual(tabularDataSnak);
        });
    });

    it('should return the right commons link', () => {
        const snak = new TabularDataSnak(tabularDataSnak);

        expect(snak.commonsLink).toEqual('https://commons.wikimedia.org/wiki/Data:Ncei.noaa.gov/weather/New York City.tab');
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new TabularDataSnak(tabularDataSnak);
            const b = new TabularDataSnak(tabularDataSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new TabularDataSnak(tabularDataSnak);
            const b = new TabularDataSnak(tabularDataSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new TabularDataSnak(tabularDataSnak);
            const snak2 = new TabularDataSnak(tabularDataSnak);
            snak2.value = 'Data:top2000.tab';

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('no-value', () => {
        it('should serialize a no-value snak without datavalue', () => {
            const snak = new TabularDataSnak({
                snaktype: 'novalue',
                property: 'P4150',
                datatype: 'tabular-data'
            } as unknown as ConstructorParameters<typeof TabularDataSnak>[0]);

            expect(snak.toJSON()).toEqual({
                snaktype: 'novalue',
                property: 'P4150',
                datatype: 'tabular-data'
            });
        });
    });

    describe('commonsLink accessor', () => {
        it('should return the correct commonsLink for a value snak', () => {
            const tabular = new TabularDataSnak({
                snaktype: 'value',
                property: 'P4150',
                datatype: 'tabular-data',
                datavalue: { value: 'Data:Weather.tab', type: 'string' }
            } as unknown as ConstructorParameters<typeof TabularDataSnak>[0]);

            expect(tabular.commonsLink).toBe('https://commons.wikimedia.org/wiki/Data:Weather.tab');
        });
    });
});
