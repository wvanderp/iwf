import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

/**
 * class for descriptions
 *
 * @class
 */
export default class Description {
    /** the language of the description */
    language: LabelLanguages;

    /** the value of the description */
    value: string;

    /**
     *
     * @param {LabelAndDescription} label the label in json format
     * @example
     */
    constructor(label: LabelAndDescription) {
        this.language = label.language;
        this.value = label.value;
    }

    /**
     * create a unique id for the Description
     *
     * @returns {string} the id
     */
    public get internalID(): string {
        return `${this.language}:${this.value}`;
    }

    /**
     * @returns {LabelAndDescription} the Description in a json format
     * @example
     *      const json = description.toJson();
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * this function checks if two descriptions are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the descriptions are equal
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
     * create a Description from a language and a value
     *
     * @param {string} language the language of the Description
     * @param {string} value the value of the Description
     * @returns {Description} the Description object
     * @example
     *     const Description = Description.fromString('en', 'Douglas Adams')
     */
    static fromString(language: LabelLanguages, value: string): Description {
        return new Description({ language, value });
    }
}
