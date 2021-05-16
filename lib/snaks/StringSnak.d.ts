import { StringSnak as WikidataStringSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the StringSnak
 *
 * most used property of this type P1545 (series ordinal)
 *
 * @class
 */
export default class StringSnak extends Snak {
    value: string | undefined;
    datatype: string;
    /**
     * @param {WikidataStringSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataStringSnak);
    /**
     *
     * @returns {WikidataStringSnak} the snak as json
     */
    toJSON(): WikidataStringSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {StringSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: StringSnak): boolean;
    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} string the string
     * @returns {StringSnak} a snak with the given properties
     */
    static fromString(property: string, string: string): StringSnak;
}
//# sourceMappingURL=StringSnak.d.ts.map