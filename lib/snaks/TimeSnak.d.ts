import { TimeSnak as WikidataTimeSnak, CalendarModels } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class TimeSnak extends Snak {
    time: string | undefined;
    timezone: number | undefined;
    before: number | undefined;
    after: number | undefined;
    precision: number | undefined;
    calendarmodel: CalendarModels | undefined;
    constructor(snak: WikidataTimeSnak);
    toJSON(): WikidataTimeSnak;
}
//# sourceMappingURL=TimeSnak.d.ts.map