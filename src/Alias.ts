import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';

import normalizeOutput from './utils/normalizeOutput';

/**
 * Class for aliases.
 *
 * @class
 */
export default class Alias {
    /** The language of the alias. */
    language: LabelLanguages;

    /** The value of the alias. */
    value: string;

    /**
     * Constructor for Alias.
     *
     * @param {LabelAndDescription} alias The alias in JSON format.
     * @example
     *    const alias = new Alias({ language: 'en', value: 'Douglas Adams' });
     */
    constructor(alias: LabelAndDescription) {
        this.language = alias.language;
        this.value = alias.value;
    }

    /**
     * Create a unique ID for the Alias.
     *
     * @returns {string} The ID.
     */
    public get internalID(): string {
        return `${this.language}:${this.value}`;
    }

    /**
     * Convert the alias to a JSON format.
     *
     * @returns {LabelAndDescription} The alias in JSON format.
     * @example
     *      const json = alias.toJSON();
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * Check if two Aliases are equal.
     *
     * @param {LabelAndDescription} other The other alias.
     * @returns {boolean} True if the aliases are equal.
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
     * Create an Alias from a language and a value.
     *
     * @param {LabelLanguages} language The language of the Alias.
     * @param {string} value The value of the Alias.
     * @returns {Alias} The Alias object.
     * @example
     *     const alias = Alias.fromString('en', 'Douglas Adams');
     */
    static fromString(language: LabelLanguages, value: string): Alias {
        return new Alias({ language, value });
    }
}
