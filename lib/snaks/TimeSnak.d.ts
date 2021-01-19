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
     * @static
     * @param {TimeSnak} a snak a
     * @param {TimeSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: TimeSnak, b: TimeSnak): boolean;
}
//# sourceMappingURL=TimeSnak.d.ts.map