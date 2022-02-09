import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import normalizeOutput from './utils/normalizeOutput';
/**
 * class for descriptions
 *
 * @class
 */
export default class Description {
    /** A ID for using things that don't have an ID */
    internalID: string;

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
        this.internalID = uuidv4();
    }

    /**
     * @returns {LabelAndDescription} the Description in a json format
     * @example
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
     */
    equals(other: LabelAndDescription): boolean {
        return this.language === other.language && this.value === other.value;
    }
}
