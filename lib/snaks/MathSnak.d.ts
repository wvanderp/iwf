import { MathSnak as WikidataMathSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the MathSnak
 *
 * most used property of this type P2534 (defining formula)
 *
 * @class
 */
export default class MathSnak extends Snak {
    /** A math expression */
    value: string | undefined;
    datatype: string;
    /**
     * @param {WikidataMathSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataMathSnak);
    /**
     *
     * @returns {WikidataMathSnak} the snak as json
     */
    toJSON(): WikidataMathSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {MathSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: MathSnak): boolean;
}
//# sourceMappingURL=MathSnak.d.ts.map