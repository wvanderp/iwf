import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
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
     */
    constructor(label: LabelAndDescription);
    /**
     * @returns {LabelAndDescription} the Description in a json format
     */
    toJSON(): LabelAndDescription;
    /**
     * this function checks if two descriptions are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the descriptions are equal
     */
    equals(other: LabelAndDescription): boolean;
}
//# sourceMappingURL=Description.d.ts.map