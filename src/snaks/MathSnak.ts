import { MathSnak as WikidataMathSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'math';

/**
 * Class for the MathSnak.
 *
 * Most used property of this type is P2534 (defining formula).
 *
 * @class
 */
export default class MathSnak extends Snak {
    /** A math expression */
    value: string | undefined;

    datatype = dataType;

    /**
     * @param {WikidataMathSnak} snak The snak for this class in JSON format.
     * @example
     *   const snak = new MathSnak(json);
     */
    constructor(snak: WikidataMathSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     * @returns {WikidataMathSnak} The snak as JSON.
     * @example
     *      const json = mathSnak.toJSON();
     */
    toJSON(): WikidataMathSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value as string,
                type: 'string' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param {MathSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: MathSnak): boolean {
        return this.value === other.value && this.property === other.property;
    }
}
