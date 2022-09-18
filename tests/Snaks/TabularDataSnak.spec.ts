import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TabularDataSnak } from '../../src';

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

            expect(snak.toJSON()).to.deep.equal(tabularDataSnak);
        });
    });

    it('should return the right commons link', () => {
        const snak = new TabularDataSnak(tabularDataSnak);

        expect(snak.commonsLink).to.equal('https://commons.wikimedia.org/wiki/Data:Ncei.noaa.gov/weather/New York City.tab');
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new TabularDataSnak(tabularDataSnak);
            const b = new TabularDataSnak(tabularDataSnak);

            expect(a.equals(b)).to.be.true;
        });

        it('should be false if the property changes', () => {
            const a = new TabularDataSnak(tabularDataSnak);
            const b = new TabularDataSnak(tabularDataSnak);

            b.property = 'P42';

            expect(a.equals(b)).to.be.false;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new TabularDataSnak(tabularDataSnak);
            const snak2 = new TabularDataSnak(tabularDataSnak);
            snak2.value = 'Data:top2000.tab';

            expect(snak.equals(snak2)).to.be.false;
        });
    });
});
