import { MusicalNotationSnak as WikidataMusicalNotationSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the MusicalNotationSnak
 *
 * most used property of this type P6883 (LilyPond notation)
 *
 * @class
 */
export default class MusicalNotationSnak extends Snak {
    value: string | undefined;
    datatype: string;
    /**
     * @param {WikidataMusicalNotationSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataMusicalNotationSnak);
    /**
     *
     * @returns {WikidataMusicalNotationSnak} the snak as json
     */
    toJSON(): WikidataMusicalNotationSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {MusicalNotationSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: MusicalNotationSnak): boolean;
}
//# sourceMappingURL=MusicalNotationSnak.d.ts.map