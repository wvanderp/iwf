import { MonolingualTextSnak as WikidataMonolingualTextSnak, MonolingualLanguages } from '@wmde/wikibase-datamodel-types';

import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'monolingualtext';

/**
 * Class for the MonolingualTextSnak.
 *
 * Most used property of this type is P1476 (title).
 *
 * @class
 */
export default class MonolingualTextSnak extends Snak {
    /** The value of the snak. */
    text: string | undefined;

    /** The language of the value. */
    language: string | undefined;

    datatype = dataType;

    /**
     * @param snak The snak that will be parsed.
     * @example
     *   const snak = new MonolingualTextSnak(json);
     */
    constructor(snak: WikidataMonolingualTextSnak) {
        super(snak);

        this.language = snak.datavalue?.value.language;
        this.text = snak.datavalue?.value.text;
    }

    /**
     * @returns The snak as JSON.
     * @example
     *      const json = monolingualTextSnak.toJSON();
     */
    toJSON(): WikidataMonolingualTextSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    text: this.text as string,
                    language: this.language as MonolingualLanguages
                },
                type: 'monolingualtext' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param other The other snak.
     * @returns True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: MonolingualTextSnak): boolean {
        return this.text === other.text
            && this.language === other.language
            && this.property === other.property;
    }

    /**
     * @static
     * @param property The property of the snak in 'P-form'.
     * @param language The language of the snak.
     * @param value The value.
     * @returns A snak with the given properties.
     * @example
     *   const snak = MonolingualTextSnak.fromString('P1476', 'en', 'test');
     */
    static fromString(property: PString, language: MonolingualLanguages, value: string): MonolingualTextSnak {
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
            datatype: dataType
        });
    }
}
