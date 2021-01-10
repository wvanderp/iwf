import { QuantitySnak as WikidataQuantitySnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class QuantitySnak extends Snak {
    _amount: string | undefined;
    _upperBound: string | undefined;
    _lowerBound: string | undefined;
    unit: string | undefined;
    datatype: string;
    constructor(snak: WikidataQuantitySnak);
    get amount(): number;
    set amount(number: number);
    get upperBound(): number;
    set upperBound(number: number);
    get lowerBound(): number;
    set lowerBound(number: number);
    toJSON(): WikidataQuantitySnak;
}
//# sourceMappingURL=QuantitySnak.d.ts.map