import { StringSnak as WikidataStringSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the StringSnak.
 *
 * Most used property of this type P1545 (series ordinal).
 *
 * @class
 */
export default class StringSnak extends Snak {
    value: string | undefined;

    datatype = 'string';

    /**
     * @param {WikidataStringSnak} snak The snak for this class in JSON format.
     * @example
     *      const snak = new StringSnak(json);
     */
    constructor(snak: WikidataStringSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     *
     * @returns {WikidataStringSnak} The snak as JSON.
     * @example
     *      const json = stringSnak.toJson();
     */
    toJSON(): WikidataStringSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataStringSnak;
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param {StringSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (stringSnak.equals(other)) {
     *      // do something
     *    }
     */
    equals(other: StringSnak): boolean {
        return this.value === other.value && this.property === other.property;
    }

    /**
     * @static
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {string} string The string.
     * @returns {StringSnak} A snak with the given properties.
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    static fromString(property: PString, string: string): StringSnak {
        return new StringSnak({
            snaktype: 'value',
            property,
            datatype: 'string',
            datavalue: {
                value: string,
                type: 'string'
            }
        });
    }
}
