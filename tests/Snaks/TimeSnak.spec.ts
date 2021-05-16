/* eslint-disable sonarjs/no-duplicate-string */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TimeSnak } from '../../src';

const timeSnak = {
    snaktype: 'value' as const,
    property: 'P582',
    datavalue: {
        value: {
            time: '+1442-00-00T00:00:00Z',
            timezone: 0,
            before: 0,
            after: 0,
            precision: 9,
            calendarmodel: 'http://www.wikidata.org/entity/Q1985786' as const
        },
        type: 'time' as const
    },
    datatype: 'time' as const
};

describe('Time Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new TimeSnak(timeSnak);

            expect(snak.toJSON()).to.deep.equal(timeSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const snak = new TimeSnak(timeSnak);

            expect(snak.equals(snak)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new TimeSnak(timeSnak);
            const snak2 = new TimeSnak(timeSnak);
            snak2.time = '2013';

            expect(snak.equals(snak2)).to.be.false;
        });
    });

    describe('fromDate', () => {
        it('should create a snak from the ID', () => {
            const date = new Date(44, 11, 17);
            const snak = TimeSnak.fromDate('P813', date);

            const expectedString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;

            expect(snak.property).to.equal('P813');
            expect(snak.time).to.equal(expectedString);
            expect(snak.calendarmodel).to.equal('http://www.wikidata.org/entity/Q1985786');
            expect(snak.precision).to.equal(11);
        });

        it('should create a snak from an ID', () => {
            const date = new Date(44, 11, 17);
            const snak = TimeSnak.fromDate('P813', date, 'http://www.wikidata.org/entity/Q1985727');

            const expectedString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;

            expect(snak.property).to.equal('P813');
            expect(snak.time).to.equal(expectedString);
            expect(snak.calendarmodel).to.equal('http://www.wikidata.org/entity/Q1985727');
            expect(snak.precision).to.equal(11);
        });

        it('should create a snak from an ID', () => {
            const date = new Date(-44, 11, 17);
            const snak = TimeSnak.fromDate('P813', date);

            const expectedString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;

            expect(snak.property).to.equal('P813');
            expect(snak.time).to.equal(expectedString);
            expect(snak.calendarmodel).to.equal('http://www.wikidata.org/entity/Q1985786');
            expect(snak.precision).to.equal(11);
        });
    });
});
