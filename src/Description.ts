import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

/**
 * Class for descriptions.
 *
 * @class
 */
export default class Description {
    /**
     * The language of the description.
     * Nearly all languages are supported, but wikidata does not have `mul` (default for all languages) for descriptions
     */
    language: Exclude<LabelLanguages, 'mul'>;

    /** The value of the description. */
    value: string;

    /**
     * Constructor for the Description class.
     *
     * @param {LabelAndDescription} label The label in JSON format.
     * @example
     *   const description = new Description({ language: 'en', value: 'Douglas Adams' });
     */
    constructor(label: LabelAndDescription) {
        if (label.language === 'mul') {
            throw new Error("The 'mul' language is not allowed for descriptions.");
        }
        this.language = label.language as Exclude<LabelLanguages, 'mul'>;
        this.value = label.value;
    }

    /**
     * Create a unique ID for the Description.
     *
     * @returns {string} The ID.
     */
    public get internalID(): string {
        return `${this.language}:${this.value}`;
    }

    /**
     * Convert the Description to a JSON format.
     *
     * @returns {LabelAndDescription} The Description in JSON format.
     * @example
     *      const json = description.toJSON();
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * Check if two descriptions are equal.
     *
     * @param {LabelAndDescription} other The other label.
     * @returns {boolean} True if the descriptions are equal.
     * @example
     *   const description1 = new Description({ language: 'en', value: 'foo' });
     *   const description2 = new Description({ language: 'en', value: 'bar' });
     *
     *   description1.equals(description2); // false
     */
    equals(other: LabelAndDescription): boolean {
        return this.language === other.language && this.value === other.value;
    }

    /**
     * Create a Description from a language and a value.
     *
     * @param {string} language The language of the Description.
     * @param {string} value The value of the Description.
     * @returns {Description} The Description object.
     * @example
     *     const description = Description.fromString('en', 'Douglas Adams');
     */
    static fromString(language: LabelLanguages, value: string): Description {
        return new Description({ language, value });
    }
}
