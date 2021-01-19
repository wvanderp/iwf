import {TimeSnak as WikidataTimeSnak, CalendarModels} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
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
     * @static
     * @param {TimeSnak} a snak a
     * @param {TimeSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a:TimeSnak, b:TimeSnak): boolean {
        return a.time === b.time
        && a.timezone === b.timezone
        && a.before === b.before
        && a.after === b.after
        && a.precision === b.precision
        && a.calendarmodel === b.calendarmodel;
    }
}
