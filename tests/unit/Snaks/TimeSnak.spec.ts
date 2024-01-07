/* eslint-disable sonarjs/no-duplicate-string */

import { TimeSnak } from '../../../src';
import { formatISOString } from '../../../src/snaks/TimeSnak';

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
    describe('formatISOString', () => {
        it('should format a date to an ISO string', () => {
            const isoString = formatISOString(2020, 12, 17);

            expect(isoString).toEqual('+2020-12-17T00:00:00Z');
        });

        it('should format a date to an ISO string with a negative year', () => {
            const isoString = formatISOString(-44, 12, 17);

            expect(isoString).toEqual('-44-12-17T00:00:00Z');
        });

        it('should ignore any time information', () => {
            const isoString = formatISOString(2020, 12, 17);

            expect(isoString).toEqual('+2020-12-17T00:00:00Z');
        });

        it('should add a leading zero to digits below 10', () => {
            const isoString = formatISOString(2021, 2, 7);

            expect(isoString).toEqual('+2021-02-07T00:00:00Z');
        });
    });

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
            const snak = TimeSnak.fromDate('P813', 44, 12, 17);

            const expectedString = '+44-12-17T00:00:00Z';

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985727');
            expect(snak.precision).toEqual(11);
        });

        it('should create a snak from an ID with a different calender', () => {
            const snak = TimeSnak.fromDate('P813', 44, 12, 17, 'http://www.wikidata.org/entity/Q1985786');

            const expectedString = '+44-12-17T00:00:00Z';

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985786');
            expect(snak.precision).toEqual(11);
        });

        it('should create a snak from an ID in a negative year', () => {
            const snak = TimeSnak.fromDate('P813', -44, 12, 17);

            const expectedString = '-44-12-17T00:00:00Z';

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985727');
            expect(snak.precision).toEqual(11);
        });
    });

    describe('fromDateObject', () => {
        it('should create a snak from the ID', () => {
            const snak = TimeSnak.fromDateObject('P813', new Date(Date.parse('2022-12-17')));

            const expectedString = '+2022-12-17T00:00:00Z';

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985727');
            expect(snak.precision).toEqual(11);
        });

        it('should work with a time near 00:00:00', () => {
            const snak = TimeSnak.fromDateObject('P813', new Date(Date.parse('2022-12-17T00:00:00')));

            const expectedString = '+2022-12-17T00:00:00Z';

            expect(snak.property).toEqual('P813');
            expect(snak.time).toEqual(expectedString);
            expect(snak.calendarmodel).toEqual('http://www.wikidata.org/entity/Q1985727');
            expect(snak.precision).toEqual(11);
        });
    });
});
