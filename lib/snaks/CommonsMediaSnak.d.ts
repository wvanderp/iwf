import { CommonsMediaSnak as WikidataCommonsMediaSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class CommonsMediaSnak extends Snak {
    fileName: string | null;
    datatype: string;
    constructor(snak: WikidataCommonsMediaSnak);
    get imageLink(): string;
    get commonsLink(): string;
    toJSON(): WikidataCommonsMediaSnak;
}
//# sourceMappingURL=CommonsMediaSnak.d.ts.map