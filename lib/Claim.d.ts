import { Statement as wikidataClaim } from '@wmde/wikibase-datamodel-types';
import Reference from './Reference';
import Snak from './Snak';
export default class Claim {
    id: string | undefined;
    type: 'statement';
    rank: 'normal' | 'preferred' | 'deprecated';
    mainsnak: Snak;
    references: Reference[];
    qualifiers: Snak[];
    qualifiersOrder: string[];
    constructor(claim: wikidataClaim);
    toJSON(): wikidataClaim;
}
//# sourceMappingURL=Claim.d.ts.map