import { ExternalIdentifierSnak as WikidataExternalIdentifierSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class ExternalIdentifierSnak extends Snak {
    id: string | null;
    datatype: string;
    constructor(snak: WikidataExternalIdentifierSnak);
    toJSON(): WikidataExternalIdentifierSnak;
}
//# sourceMappingURL=ExternalIdentifierSnak.d.ts.map