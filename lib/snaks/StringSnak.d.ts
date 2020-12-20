import { StringSnak as WikidataStringSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class StringSnak extends Snak {
    value: string | undefined;
    constructor(snak: WikidataStringSnak);
    toJSON(): WikidataStringSnak;
}
//# sourceMappingURL=StringSnak.d.ts.map