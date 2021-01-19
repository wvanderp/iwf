import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

/**
 * class for labels
 *
 * @class
 */
export default class Label {
    /** the language of the description */
    language: string;

    /** the value of the description */
    value: string;

    /**
     * @param {LabelAndDescription} label the label for this class in json format
     */
    constructor(label: LabelAndDescription) {
        this.language = label.language;
        this.value = label.value;
    }

    /**
     * @returns {LabelAndDescription} the label as json
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * this function checks if two labels are equal
     *
     * @static
     * @param {LabelAndDescription} a Label a
     * @param {LabelAndDescription} b Label b
     * @returns {boolean} true if the items are equal
     */
    static equals(a: LabelAndDescription, b: LabelAndDescription): boolean {
        return a.language === b.language && a.value === b.value;
    }
}
