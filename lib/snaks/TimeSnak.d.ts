import { TimeSnak as WikidataTimeSnak, CalendarModels } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
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
    datatype: string;
    /**
     * @param {WikidataTimeSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataTimeSnak);
    /**
     *
     * @returns {WikidataTimeSnak} the snak as json
     */
    toJSON(): WikidataTimeSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {TimeSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: TimeSnak): boolean;
    /**
     * dates only so add all of the date (year, month, day)
     *
     * @param {string} property the property of the snak in 'P-form'
     * @param {Date} date the date for the snak
     * @param {CalendarModels} calendarModel the calendarModel for the snak
     * @returns {TimeSnak} the timeSnak
     */
    static fromDate(property: string, date: Date, calendarModel?: CalendarModels): TimeSnak;
}
//# sourceMappingURL=TimeSnak.d.ts.map