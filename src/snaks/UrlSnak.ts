import {URLSnak as WikidataURLSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the URLSnak
 *
 * most used property of this type P854 (reference URL)
 *
 * @class
 */
export default class URLSnak extends Snak {
    value: string | undefined;

    datatype = 'url';

    /**
     * @param {WikidataURLSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataURLSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     *
     * @returns {WikidataURLSnak} the snak as json
     */
    toJSON(): WikidataURLSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataURLSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {URLSnak} a snak a
     * @param {URLSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a:URLSnak, b:URLSnak): boolean {
        return a.value === b.value;
    }
}
