import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';

import normalizeOutput from './utils/normalizeOutput';

/**
 * class for aliases
 *
 * @class
 */
export default class Alias {
    /** the language of the alias */
    language: LabelLanguages;

    /** the value of the alias */
    value: string;

    /**
     *
     * @param {LabelAndDescription} alias  the alias in json format
     * @example
     *    const Alias = new Alias({ language: 'en', value: 'Douglas Adams' });
     */
    constructor(alias: LabelAndDescription) {
        this.language = alias.language;
        this.value = alias.value;
    }

    /**
     * create a unique id for the Alias
     *
     * @returns {string} the id
     */
    public get internalID(): string {
        return `${this.language}:${this.value}`;
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

    /**
     * create a Alias from a language and a value
     *
     * @param {string} language the language of the Alias
     * @param {string} value the value of the Alias
     * @returns {Alias} the Alias object
     * @example
     *     const Alias = Alias.fromString('en', 'Douglas Adams')
     */
    static fromString(language: LabelLanguages, value: string): Alias {
        return new Alias({ language, value });
    }
}
