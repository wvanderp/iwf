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
     * @static
     * @param {StringSnak} a snak a
     * @param {StringSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: StringSnak, b: StringSnak): boolean;
}
//# sourceMappingURL=StringSnak.d.ts.map