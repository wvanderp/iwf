import {MathSnak as WikidataMathSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the MathSnak
 *
 * most used property of this type P2534 (defining formula)
 *
 * @class
 */
export default class MathSnak extends Snak {
    /** A math expression */
    value: string | undefined

    datatype = 'math';

    /**
     * @param {WikidataMathSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataMathSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     *
     * @returns {WikidataMathSnak} the snak as json
     */
    toJSON(): WikidataMathSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataMathSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {MathSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: MathSnak): boolean {
        return this.value === other.value;
    }
}
