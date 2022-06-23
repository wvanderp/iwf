import { expect } from 'chai';
import { describe, it } from 'mocha';
import { QuantitySnak } from '../../src';

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

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._amount).to.equal('+11');
                expect(snak.amount).to.equal(11);
            });

            it('the amount setter should handel decimals', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.amount = 11.11;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._amount).to.equal('+11.11');
                expect(snak.amount).to.equal(11.11);
            });

            it('the amount setter should handel negative numbers', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.amount = -11.11;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._amount).to.equal('-11.11');
                expect(snak.amount).to.equal(-11.11);
            });

            it('the amount setter should accept and handle undefined', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.amount = undefined;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._amount).to.equal(undefined);
                expect(snak.amount).to.equal(undefined);
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

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._upperBound).to.equal('+11');
                expect(snak.upperBound).to.equal(11);
            });

            it('the upperBound setter should handel decimals', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.upperBound = 11.11;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._upperBound).to.equal('+11.11');
                expect(snak.upperBound).to.equal(11.11);
            });

            it('the upperBound setter should handel negative numbers', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.upperBound = -11.11;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._upperBound).to.equal('-11.11');
                expect(snak.upperBound).to.equal(-11.11);
            });

            it('the upperBound setter should accept and handle undefined', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.upperBound = undefined;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._upperBound).to.equal(undefined);
                expect(snak.upperBound).to.equal(undefined);
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

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._lowerBound).to.equal('+11');
                expect(snak.lowerBound).to.equal(11);
            });

            it('the lowerBound setter should handel decimals', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.lowerBound = 11.11;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._lowerBound).to.equal('+11.11');
                expect(snak.lowerBound).to.equal(11.11);
            });

            it('the lowerBound setter should handel negative numbers', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.lowerBound = -11.11;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._lowerBound).to.equal('-11.11');
                expect(snak.lowerBound).to.equal(-11.11);
            });

            it('the lowerBound setter should accept and handle undefined', function () {
                const snak = new QuantitySnak(quantitySnak);

                snak.lowerBound = undefined;

                // @ts-expect-error cant access private members in ts but in js you can
                expect(snak._lowerBound).to.equal(undefined);
                expect(snak.lowerBound).to.equal(undefined);
            });
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new QuantitySnak(quantitySnak);

            expect(snak.toJSON()).to.deep.equal(quantitySnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new QuantitySnak(quantitySnak);

            expect(snak.equals(snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new QuantitySnak(quantitySnak);
            const snak2 = new QuantitySnak(quantitySnak);
            snak2.lowerBound = 4;

            expect(snak.equals(snak2)).to.be.false;
        });
    });

    describe('fromNumbers', () => {
        it('should create a snak from numbers with the minium arguments', () => {
            const snak = QuantitySnak.fromNumbers('P1215', 1);
            expect(snak.property).to.equal('P1215');
            expect(snak.amount).to.equal(1);
            expect(snak.upperBound).to.equal(undefined);
            expect(snak.lowerBound).to.equal(undefined);
            expect(snak.unit).to.equal('1');
        });
    });

    it('should create a snak from numbers and also with the maximum arguments ', () => {
        const snak = QuantitySnak.fromNumbers('P1215', 1, 2, 0.5, 'Q42');
        expect(snak.property).to.equal('P1215');
        expect(snak.amount).to.equal(1);
        expect(snak.upperBound).to.equal(2);
        expect(snak.lowerBound).to.equal(0.5);
        expect(snak.unit).to.equal('http://www.wikidata.org/entity/Q42');
    });
});
