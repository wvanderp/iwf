import { MathSnak as WikidataMathSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class MathSnak extends Snak {
    value: string | undefined;
    constructor(snak: WikidataMathSnak);
    toJSON(): WikidataMathSnak;
}
//# sourceMappingURL=MathSnak.d.ts.map