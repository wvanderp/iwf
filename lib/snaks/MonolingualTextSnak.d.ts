import { MonolingualTextSnak as WikidataMonolingualTextSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the MonolingualTextSnak
 *
 * most used property of this type P1476 (title)
 *
 * @class
 */
export default class MonolingualTextSnak extends Snak {
    /** the value of the snak */
    text: string | undefined;
    /** the language of the value */
    language: string | undefined;
    datatype: string;
    /**
     *
     * @param {WikidataMonolingualTextSnak} snak the snak that will be parsed
     */
    constructor(snak: WikidataMonolingualTextSnak);
    /**
     *
     * @returns {WikidataMonolingualTextSnak} the snak as json
     */
    toJSON(): WikidataMonolingualTextSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {MonolingualTextSnak} a snak a
     * @param {MonolingualTextSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: MonolingualTextSnak, b: MonolingualTextSnak): boolean;
}
//# sourceMappingURL=MonolingualTextSnak.d.ts.map