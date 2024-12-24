import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

/**
 * Class for labels.
 *
 * @class
 */
export default class Label {
    /** The language of the label. */
    language: LabelLanguages;

    /** The value of the label. */
    value: string;

    /**
     * @param {LabelAndDescription} label The label for this class in JSON format.
     * @example
     *  const label = new Label({ language: 'en', value: 'Douglas Adams' });
     */
    constructor(label: LabelAndDescription) {
        this.language = label.language;
        this.value = label.value;
    }

    /**
     * Create a unique ID for the Label.
     *
     * @returns {string} The ID.
     */
    public get internalID(): string {
        return `${this.language}:${this.value}`;
    }

    /**
     * @returns {LabelAndDescription} The label as JSON.
     * @example
     *      const json = label.toJSON();
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * This function checks if two Labels are equal.
     *
     * @param {LabelAndDescription} other The other Label.
     * @returns {boolean} True if the Labels are equal.
     * @example
     *     const label1 = new Label({ language: 'en', value: 'foo' });
     *     const label2 = new Label({ language: 'en', value: 'bar' });
     *
     *     label1.equals(label2); // false
     */
    equals(other: LabelAndDescription): boolean {
        return this.language === other.language && this.value === other.value;
    }

    /**
     * Create a label from a language and a value.
     *
     * @param {LabelLanguages} language The language of the label.
     * @param {string} value The value of the label.
     * @returns {Label} The label object.
     * @example
     *     const label = Label.fromString('en', 'Douglas Adams');
     */
    static fromString(language: LabelLanguages, value: string): Label {
        return new Label({ language, value });
    }
}
