import { MusicalNotationSnak as WikidataMusicalNotationSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'musical-notation';

/**
 * Class for the MusicalNotationSnak
 *
 * Most used property of this type P6883 (LilyPond notation)
 *
 * @class
 */
export default class MusicalNotationSnak extends Snak {
    value: string | undefined;

    datatype = dataType;

    /**
     * @param {WikidataMusicalNotationSnak} snak the snak for this class in json format
     * @example
     *  const snak = new MusicalNotationSnak(json);
     */
    constructor(snak: WikidataMusicalNotationSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     *
     * @returns {WikidataMusicalNotationSnak} the snak as json
     * @example
     *      const json = MusicSnak.toJson();
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
     * this function checks if two snaks are equal
     *
     * @param {MusicalNotationSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: MusicalNotationSnak): boolean {
        return this.value === other.value && this.property === other.property;
    }
}
