import { StringSnak as WikidataStringSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the StringSnak
 *
 * most used property of this type P1545 (series ordinal)
 *
 * @class
 */
export default class StringSnak extends Snak {
    value: string | undefined;

    datatype = 'string';

    /**
     * @param {WikidataStringSnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataStringSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     * @param {boolean} isMediainfo where to output for the mediainfo type, this changes some of the json output
     * @returns {WikidataStringSnak} the snak as json
     * @example
     */
    toJSON(isMediainfo = false): WikidataStringSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: isMediainfo ? undefined : this.datatype
        }) as WikidataStringSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {StringSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: StringSnak): boolean {
        return this.value === other.value;
    }

    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} string the string
     * @returns {StringSnak} a snak with the given properties
     * @example
     */
    static fromString(property: string, string: string): StringSnak {
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
