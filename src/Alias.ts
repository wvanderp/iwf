import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

/**
 * class for aliases
 *
 * @class
 */
export default class Alias {
    /** the language of the alias */
    language: string;

    /** the value of the alias */
    value: string;

    /**
     *
     * @param {LabelAndDescription} alias  the alias in json format
     */
    constructor(alias: LabelAndDescription) {
        this.language = alias.language;
        this.value = alias.value;
    }

    /**
     * @returns {LabelAndDescription} the alias in a json format
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * this function checks if two aliases are equal
     *
     * @static
     * @param {LabelAndDescription} a Alias a
     * @param {LabelAndDescription} b Alias b
     * @returns {boolean} true if the aliases are equal
     */
    static equals(a: LabelAndDescription, b: LabelAndDescription): boolean {
        return a.language === b.language && a.value === b.value;
    }
}
