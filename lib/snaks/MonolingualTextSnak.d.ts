import { MonolingualTextSnak as WikidataMonolingualTextSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class MonolingualTextSnak extends Snak {
    text: string | undefined;
    language: string | undefined;
    constructor(snak: WikidataMonolingualTextSnak);
    toJSON(): WikidataMonolingualTextSnak;
}
//# sourceMappingURL=MonolingualTextSnak.d.ts.map