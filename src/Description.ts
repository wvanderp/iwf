import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
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
    language: string;

    /** the value of the description */
    value: string;

    /**
     *
     * @param {LabelAndDescription} label the label in json format
     */
    constructor(label: LabelAndDescription) {
        this.language = label.language;
        this.value = label.value;
        this.internalID = uuidv4();
    }

    /**
     * @returns {LabelAndDescription} the Description in a json format
     */
    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }

    /**
     * this function checks if two Descriptions are equal
     *
     * @static
     * @param {LabelAndDescription} a Description a
     * @param {LabelAndDescription} b Description b
     * @returns {boolean} true if the Descriptions are equal
     */
    static equals(a: LabelAndDescription, b: LabelAndDescription): boolean {
        return a.language === b.language && a.value === b.value;
    }
}
