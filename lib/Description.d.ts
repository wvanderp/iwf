import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
/**
 * class for descriptions
 *
 * @class
 */
export default class Description {
    /** the language of the description */
    language: string;
    /** the value of the description */
    value: string;
    /**
     *
     * @param {LabelAndDescription} label the label in json format
     */
    constructor(label: LabelAndDescription);
    /**
     * @returns {LabelAndDescription} the Description in a json format
     */
    toJSON(): LabelAndDescription;
    /**
     * this function checks if two Descriptions are equal
     *
     * @static
     * @param {LabelAndDescription} a Description a
     * @param {LabelAndDescription} b Description b
     * @returns {boolean} true if the Descriptions are equal
     */
    static equals(a: LabelAndDescription, b: LabelAndDescription): boolean;
}
//# sourceMappingURL=Description.d.ts.map