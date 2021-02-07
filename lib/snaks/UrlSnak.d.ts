import { URLSnak as WikidataURLSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the URLSnak
 *
 * most used property of this type P854 (reference URL)
 *
 * @class
 */
export default class URLSnak extends Snak {
    url: string | undefined;
    datatype: string;
    /**
     * @param {WikidataURLSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataURLSnak);
    /**
     * @alias url
     * @returns {string | undefined} the value of the snak
     */
    get value(): string | undefined;
    /**
     * @alias url
     * @param {string | undefined} value the value of the snak
     */
    set value(value: string | undefined);
    /**
     *
     * @returns {WikidataURLSnak} the snak as json
     */
    toJSON(): WikidataURLSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {URLSnak} a snak a
     * @param {URLSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: URLSnak, b: URLSnak): boolean;
    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} url the url
     * @returns {URLSnak} a snak with the given properties
     */
    static fromURL(property: string, url: string): URLSnak;
}
//# sourceMappingURL=UrlSnak.d.ts.map