import { MusicalNotationSnak as WikidataMusicalNotationSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class MusicalNotationSnak extends Snak {
    value: string | undefined;
    datatype: string;
    constructor(snak: WikidataMusicalNotationSnak);
    toJSON(): WikidataMusicalNotationSnak;
}
//# sourceMappingURL=MusicalNotationSnak.d.ts.map