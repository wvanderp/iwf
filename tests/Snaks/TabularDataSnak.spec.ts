import { expect } from 'chai';
import { describe, it } from 'mocha';
import TabularDataSnak from '../../src/snaks/TabularDataSnak';

const tabularDataSnak = {
    snaktype: 'value' as const,
    property: 'P4150',
    datavalue: {
        value: 'Data:Ncei.noaa.gov/weather/New York City.tab',
        type: 'string'
    },
    datatype: 'tabular-data' as const
};

describe('Tabular Data Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new TabularDataSnak(tabularDataSnak);

            expect(snak.toJSON()).to.deep.equal(tabularDataSnak);
        });
    });
});
