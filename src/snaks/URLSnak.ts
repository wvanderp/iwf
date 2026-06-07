/* eslint-disable unicorn/filename-case */
import { URLSnak as WikidataURLSnak } from '@wmde/wikibase-datamodel-types';

import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the URLSnak.
 *
 * Most used property of this type is P854 (reference URL).
 *
 * @class
 */
export default class URLSnak extends Snak {
    url: string | undefined;

    datatype = 'url';

    /**
     * @param snak The snak for this class in JSON format.
     * @example
     *     const snak = new URLSnak(json);
     */
    constructor(snak: WikidataURLSnak) {
        super(snak);

        this.url = snak.datavalue?.value;
    }

    /**
     * The value will be URL encoded.
     *
     * @alias url
     * @returns The value of the snak.
     */
    get value(): string | undefined {
        if (!this.url) return undefined;
        return encodeURI(this.url);
    }

    /**
     * @alias url
     * @param value The value of the snak.
     */
    set value(value: string | undefined) {
        this.url = value;
    }

    /**
     *
     * @returns The snak as JSON.
     * @example
     *      const json = urlSnak.toJSON();
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
     * This function checks if two snaks are equal.
     *
     * @param other The other snak.
     * @returns True if the snaks are equal.
     * @example
     *   if (urlSnak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: URLSnak): boolean {
        return this.url === other.url && this.property === other.property;
    }

    /**
     * @static
     * @param property The property of the snak in 'P-form'.
     * @param url The URL.
     * @returns A snak with the given properties.
     * @example
     *    const snak = URLSnak.fromURL('P854', 'https://example.com');
     */
    static fromURL(property: PString, url: string): URLSnak {
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
