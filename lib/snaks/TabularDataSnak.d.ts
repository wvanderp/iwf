import { TabularDataSnak as WikidataTabularDataSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class TabularDataSnak extends Snak {
    value: string | undefined;
    constructor(snak: WikidataTabularDataSnak);
    toJSON(): WikidataTabularDataSnak;
}
//# sourceMappingURL=TabularDataSnak.d.ts.map