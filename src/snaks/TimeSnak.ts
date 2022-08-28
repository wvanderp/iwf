import { TimeSnak as WikidataTimeSnak, CalendarModels } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the TimeSnak
 *
 * most used property of this type P1619 (date of official opening)
 *
 * @class
 */
export default class TimeSnak extends Snak {
    time: string | undefined;

    timezone: number | undefined;

    before: number | undefined;

    after: number | undefined;

    precision: number | undefined;

    calendarmodel: CalendarModels | undefined;

    datatype = 'time';

    /**
     * @param {WikidataTimeSnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataTimeSnak) {
        super(snak);

        this.time = snak.datavalue?.value.time;
        this.timezone = snak.datavalue?.value.timezone;
        this.before = snak.datavalue?.value.before;
        this.after = snak.datavalue?.value.after;
        this.precision = snak.datavalue?.value.precision;
        this.calendarmodel = snak.datavalue?.value.calendarmodel;
    }

    /**
     *
     * @returns {WikidataTimeSnak} the snak as json
     * @example
     *      const json = timeSnak.toJson();
     */
    toJSON(): WikidataTimeSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    time: this.time,
                    timezone: this.timezone,
                    before: this.before,
                    after: this.after,
                    precision: this.precision,
                    calendarmodel: this.calendarmodel
                },
                type: 'time' as const
            } : undefined,
            datatype: this.datatype
        }) as WikidataTimeSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {TimeSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: TimeSnak): boolean {
        return this.time === other.time
            && this.timezone === other.timezone
            && this.before === other.before
            && this.after === other.after
            && this.precision === other.precision
            && this.calendarmodel === other.calendarmodel;
    }

    /**
     * dates only so add all of the date (year, month, day)
     *
     * @param {PString} property the property of the snak in 'P-form'
     * @param {Date} date the date for the snak
     * @param {CalendarModels} calendarModel the calendarModel for the snak
     * @returns {TimeSnak} the timeSnak
     * @example
     */
    static fromDate(property: PString, date: Date, calendarModel: CalendarModels = 'http://www.wikidata.org/entity/Q1985786'): TimeSnak {
        const isoString = date.toISOString().slice(0, 1) === '-' ? date.toISOString() : `+${date.toISOString()}`;
        return new TimeSnak({
            snaktype: 'value',
            property,
            datavalue: {
                value: {
                    time: isoString,
                    timezone: 0,
                    before: 0,
                    after: 0,
                    precision: 11,
                    calendarmodel: calendarModel
                },
                type: 'time'
            },
            datatype: 'time'
        });
    }
}
