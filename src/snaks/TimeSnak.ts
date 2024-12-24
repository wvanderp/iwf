import { TimeSnak as WikidataTimeSnak, CalendarModels } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * The formatting is a bit weird because it is ISO 8601-like but with the following exceptions:
 * 1. You need to add a '+' in front of the date if it is after 0 AD and a '-' if it is before 0 AD.
 * 2. You can't be more precise than a day, so the time is always 00:00:00.
 *
 * So the date 30 January 2020 would be +2020-01-30T00:00:00Z.
 *
 * @see https://www.wikidata.org/wiki/Help:Dates
 *
 * @private
 * @param {number} year The year of the date.
 * @param {number} month The month of the date (1-12), so just the normal months.
 * @param {number} day The day of the date (1-31).
 * @returns {string} The date in the special Wikidata ISO format.
 * @example
 */
export function formatISOString(year: number, month: number, day: number): string {
    const yearString = year.toString();
    const monthString = month.toString().padStart(2, '0');
    const dayString = day.toString().padStart(2, '0');

    return `${year >= 0 ? '+' : ''}${yearString}-${monthString}-${dayString}T00:00:00Z`;
}

/**
 * Class for the TimeSnak.
 *
 * Most used property of this type is P1619 (date of official opening).
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
     * @param {WikidataTimeSnak} snak The snak for this class in JSON format.
     * @example
     *     const snak = new TimeSnak(json);
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
     * @returns {WikidataTimeSnak} The snak as JSON.
     * @example
     *      const json = timeSnak.toJSON();
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
     * This function checks if two snaks are equal.
     *
     * @param {TimeSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: TimeSnak): boolean {
        return this.time === other.time
            && this.timezone === other.timezone
            && this.before === other.before
            && this.after === other.after
            && this.precision === other.precision
            && this.calendarmodel === other.calendarmodel
            && this.property === other.property;
    }

    /**
     * Dates only, so add all of the date (year, month, day).
     *
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {number} year The year of the date.
     * @param {number} month The month of the date (1-12), so just the normal months.
     * @param {number} day The day of the date (1-31).
     * @param {CalendarModels} calendarModel The calendar model for the snak.
     * @returns {TimeSnak} The TimeSnak.
     * @example
     *    const snak = TimeSnak.fromDate('P1619', 2020, 1, 30, 'http://www.wikidata.org/entity/Q1985727');
     */
    static fromDate(property: PString, year: number, month: number, day: number, calendarModel: CalendarModels = 'http://www.wikidata.org/entity/Q1985727'): TimeSnak {
        const isoString = formatISOString(year, month, day);
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

    /**
     * Create a TimeSnak from a Date object.
     *
     * WARNING: JS Dates are horrible and you should not use them. Use a library like moment.js instead.
     * When using it normally you should be fine, but anything before 1970 will be wrong.
     * Also, timezones are not supported, so you need to use UTC which conflicts with Wikidata that assumes that all dates are in the local timezone.
     *
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {Date} date The Date object.
     * @param {CalendarModels} calendarModel The calendar model for the snak.
     * @returns {TimeSnak} The TimeSnak.
     * @example
     *    const snak = TimeSnak.fromDateObject('P1619', new Date(), 'http://www.wikidata.org/entity/Q1985727');
     */
    static fromDateObject(property: PString, date: Date, calendarModel: CalendarModels = 'http://www.wikidata.org/entity/Q1985727'): TimeSnak {
        return TimeSnak.fromDate(property, date.getFullYear(), date.getMonth() + 1, date.getDate(), calendarModel);
    }
}
