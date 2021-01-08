import { expect } from 'chai';
import { describe, it } from 'mocha';
import QuantitySnak from '../../src/snaks/QuantitySnak';

const quantitySnak = {
    snaktype: 'value' as const,
    property: 'P2120',
    datavalue: {
        value: {
            amount: '+6371.0',
            unit: 'http://www.wikidata.org/entity/Q828224',
            upperBound: '+6371.1',
            lowerBound: '+6370.9'
        },
        type: 'quantity' as const
    },
    datatype: 'quantity' as const
};

describe('Quantity Snak', () => {
    describe('getters and Setters', function () {
        describe('amount', function () {
            it('get amount should return an number', function () {
                const snak = new QuantitySnak(quantitySnak);

                expect(typeof snak.amount).to.equal('number');
                expect(snak.amount).to.equal(6371);
            });

            it('the amount setter should set and format the amount right', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.amount = 11;

                expect(snak._amount).to.equal('+11');
                expect(snak.amount).to.equal(11);
            });

            it('the amount setter should handel decimals', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.amount = 11.11;

                expect(snak._amount).to.equal('+11.11');
                expect(snak.amount).to.equal(11.11);
            });

            it('the amount setter should handel negative numbers', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.amount = -11.11;

                expect(snak._amount).to.equal('-11.11');
                expect(snak.amount).to.equal(-11.11);
            });
        });

        describe('upperBound', function () {
            it('get upperBound should return an number', function () {
                const snak = new QuantitySnak(quantitySnak);

                expect(typeof snak.upperBound).to.equal('number');
                expect(snak.upperBound).to.equal(6371.1);
            });

            it('the upperBound setter should set and format the upperBound right', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.upperBound = 11;

                expect(snak._upperBound).to.equal('+11');
                expect(snak.upperBound).to.equal(11);
            });

            it('the upperBound setter should handel decimals', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.upperBound = 11.11;

                expect(snak._upperBound).to.equal('+11.11');
                expect(snak.upperBound).to.equal(11.11);
            });

            it('the upperBound setter should handel negative numbers', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.upperBound = -11.11;

                expect(snak._upperBound).to.equal('-11.11');
                expect(snak.upperBound).to.equal(-11.11);
            });
        });

        describe('lowerBound', function () {
            it('get lowerBound should return an number', function () {
                const snak = new QuantitySnak(quantitySnak);

                expect(typeof snak.lowerBound).to.equal('number');
                expect(snak.lowerBound).to.equal(6370.9);
            });

            it('the lowerBound setter should set and format the lowerBound right', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.lowerBound = 11;

                expect(snak._lowerBound).to.equal('+11');
                expect(snak.lowerBound).to.equal(11);
            });

            it('the lowerBound setter should handel decimals', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.lowerBound = 11.11;

                expect(snak._lowerBound).to.equal('+11.11');
                expect(snak.lowerBound).to.equal(11.11);
            });

            it('the lowerBound setter should handel negative numbers', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.lowerBound = -11.11;

                expect(snak._lowerBound).to.equal('-11.11');
                expect(snak.lowerBound).to.equal(-11.11);
            });
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new QuantitySnak(quantitySnak);

            expect(snak.toJSON()).to.deep.equal(quantitySnak);
        });
    });
});
