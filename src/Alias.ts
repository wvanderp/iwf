import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import normalizeOutput from './utils/normalizeOutput';

/**
 * class for aliases
 *
 * @class
 */
export default class Alias {
    /** A ID for using things that don't have an ID */
    internalID: string;

    /** the language of the alias */
    language: LabelLanguages;

    /** the value of the alias */
    value: string;

    /**
     *
     * @param {LabelAndDescription} alias  the alias in json format
     * @example
     */
    constructor(alias: LabelAndDescription) {
        this.language = alias.language;
        this.value = alias.value;
        this.internalID = uuidv4();
    }

    /**
     * @returns {LabelAndDescription} the alias in a json format
     * @example
     *      const json = alias.toJson();
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * this function checks if two Aliases are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the Aliases are equal
     * @example
     *    const alias1 = new Alias({ language: 'en', value: 'foo' });
     *    const alias2 = new Alias({ language: 'en', value: 'bar' });
     *
     *    alias1.equals(alias2); // false
     */
    equals(other: LabelAndDescription): boolean {
        return this.language === other.language && this.value === other.value;
    }
}
