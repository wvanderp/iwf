import { Statement as wikidataStatement } from '@wmde/wikibase-datamodel-types';
import Reference from './Reference';
import Snak from './Snak';
export default class Statement {
    id: string | undefined;
    type: 'statement';
    rank: 'normal' | 'preferred' | 'deprecated';
    mainsnak: Snak;
    references: Reference[];
    qualifiers: Snak[];
    qualifiersOrder: string[];
    constructor(statement: wikidataStatement);
    toJSON(): wikidataStatement;
}
//# sourceMappingURL=Statement.d.ts.map