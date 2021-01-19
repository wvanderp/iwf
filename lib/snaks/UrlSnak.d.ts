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
    value: string | undefined;
    datatype: string;
    /**
     * @param {WikidataURLSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataURLSnak);
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
}
//# sourceMappingURL=UrlSnak.d.ts.map