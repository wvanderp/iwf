/* eslint-disable sonarjs/no-duplicate-string */

import { TimeSnak } from '../../../src';

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

            expect(snak.toJSON()).toStrictEqual(timeSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new TimeSnak(timeSnak);
            const b = new TimeSnak(timeSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new TimeSnak(timeSnak);
            const b = new TimeSnak(timeSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new TimeSnak(timeSnak);
            const snak2 = new TimeSnak(timeSnak);
            snak2.time = '2013';

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('fromDate', () => {
        it('should create a snak from the ID', () => {
            const date = new Date(44, 11, 17);
            const snak = TimeSnak.fromDate('P813', date);

            const expectedString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985786');
            expect(snak.precision).toEqual(11);
        });

        it('should create a snak from an ID', () => {
            const date = new Date(44, 11, 17);
            const snak = TimeSnak.fromDate('P813', date, 'http://www.wikidata.org/entity/Q1985727');

            const expectedString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985727');
            expect(snak.precision).toEqual(11);
        });

        it('should create a snak from an ID in a different calender', () => {
            const date = new Date(-44, 11, 17);
            const snak = TimeSnak.fromDate('P813', date);

            const expectedString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985786');
            expect(snak.precision).toEqual(11);
        });
    });
});
