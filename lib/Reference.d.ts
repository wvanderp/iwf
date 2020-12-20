import { Reference as WikidataReference } from '@wmde/wikibase-datamodel-types';
import Snak from './Snak';
export default class Reference {
    hash: string;
    snaksOrder: string[] | undefined;
    snaks: Snak[];
    constructor(reference: WikidataReference);
    toJSON(): WikidataReference;
}
//# sourceMappingURL=Reference.d.ts.map