import { URLSnak as WikidataURLSnak } from '@wmde/wikibase-datamodel-types';
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
    url: string | undefined;

    datatype = 'url';

    /**
     * @param {WikidataURLSnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataURLSnak) {
        super(snak);

        this.url = snak.datavalue?.value;
    }

    /**
     * @alias url
     * @returns {string | undefined} the value of the snak
     */
    get value(): string | undefined {
        return this.url;
    }

    /**
     * @alias url
     * @param {string | undefined} value the value of the snak
     */
    set value(value: string | undefined) {
        this.url = value;
    }

    /**
     *
     * @returns {WikidataURLSnak} the snak as json
     * @example
     */
    toJSON(): WikidataURLSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.url,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataURLSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {URLSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: URLSnak): boolean {
        return this.value === other.value;
    }

    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} url the url
     * @returns {URLSnak} a snak with the given properties
     * @example
     */
    static fromURL(property: string, url: string): URLSnak {
        return new URLSnak({
            snaktype: 'value',
            property,
            datatype: 'url',
            datavalue: {
                value: url,
                type: 'string'
            }
        });
    }
}
