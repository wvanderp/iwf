import { MusicalNotationSnak as WikidataMusicalNotationSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'musical-notation';

/**
 * Class for the MusicalNotationSnak.
 *
 * Most used property of this type is P6883 (LilyPond notation).
 *
 * @class
 */
export default class MusicalNotationSnak extends Snak {
    value: string | undefined;

    datatype = dataType;

    /**
     * @param {WikidataMusicalNotationSnak} snak The snak for this class in JSON format.
     * @example
     *  const snak = new MusicalNotationSnak(json);
     */
    constructor(snak: WikidataMusicalNotationSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     * @returns {WikidataMusicalNotationSnak} The snak as JSON.
     * @example
     *      const json = musicalNotationSnak.toJSON();
     */
    toJSON(): WikidataMusicalNotationSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value as string,
                type: 'string' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param {MusicalNotationSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: MusicalNotationSnak): boolean {
        return this.value === other.value && this.property === other.property;
    }
}
