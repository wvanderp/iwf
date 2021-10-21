import { MonolingualTextSnak as WikidataMonolingualTextSnak } from '@wmde/wikibase-datamodel-types';
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
     */
    constructor(snak: WikidataMonolingualTextSnak) {
        super(snak);

        this.language = snak.datavalue?.value.language;
        this.text = snak.datavalue?.value.text;
    }

    /**
     *
     * @returns {WikidataMonolingualTextSnak} the snak as json
     */
    toJSON(): WikidataMonolingualTextSnak {
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
            datatype: this.datatype
        }) as WikidataMonolingualTextSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {MonolingualTextSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: MonolingualTextSnak): boolean {
        return this.text === other.text && this.language === other.language;
    }
}
