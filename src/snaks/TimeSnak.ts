import {TimeSnak as WikidataTimeSnak, CalendarModels} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class TimeSnak extends Snak {
    time: string | undefined;

    timezone: number | undefined;

    before: number | undefined;

    after: number | undefined;

    precision: number | undefined;

    calendarmodel: CalendarModels | undefined;

    constructor(snak: WikidataTimeSnak) {
        super(snak);

        this.time = snak.datavalue?.value.time;
        this.timezone = snak.datavalue?.value.timezone;
        this.before = snak.datavalue?.value.before;
        this.after = snak.datavalue?.value.after;
        this.precision = snak.datavalue?.value.precision;
        this.calendarmodel = snak.datavalue?.value.calendarmodel;
    }

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
            datatype: 'time'
        }) as WikidataTimeSnak;
    }
}
