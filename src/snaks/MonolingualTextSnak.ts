import { MonolingualTextSnak as WikidataMonolingualTextSnak, MonolingualLanguages } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

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

    datatype = 'monolingualtext';

    /**
     *
     * @param {WikidataMonolingualTextSnak} snak the snak that will be parsed
     * @example
     */
    constructor(snak: WikidataMonolingualTextSnak) {
        super(snak);

        this.language = snak.datavalue?.value.language;
        this.text = snak.datavalue?.value.text;
    }

    /**
     * @param {boolean} isMediainfo where to output for the mediainfo type, this changes some of the json output
     * @returns {WikidataMonolingualTextSnak} the snak as json
     * @example
     */
    toJSON(isMediainfo = false): WikidataMonolingualTextSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    text: this.text,
                    language: this.language
                },
                type: 'monolingualtext'
            } : undefined,
            datatype: isMediainfo ? undefined : this.datatype
        }) as WikidataMonolingualTextSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {MonolingualTextSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: MonolingualTextSnak): boolean {
        return this.text === other.text && this.language === other.language;
    }

    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {MonolingualLanguages} language the language of the snak
     * @param {string} value the value
     * @returns {MonolingualTextSnak} a snak with the given properties
     * @example
     */
    static fromString(property: string, language: MonolingualLanguages, value: string): MonolingualTextSnak {
        return new MonolingualTextSnak({
            snaktype: 'value' as const,
            property,
            datavalue: {
                value: {
                    text: value,
                    language
                },
                type: 'monolingualtext'
            },
            datatype: 'monolingualtext'
        });
    }
}
