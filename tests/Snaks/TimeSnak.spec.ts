import { expect } from 'chai';
import { describe, it } from 'mocha';
import TimeSnak from '../../src/snaks/TimeSnak';

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
});
