import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
/**
 * class for labels
 *
 * @class
 */
export default class Label {
    /** A ID for using things that don't have an ID */
    internalID: string;
    /** the language of the description */
    language: string;
    /** the value of the description */
    value: string;
    /**
     * @param {LabelAndDescription} label the label for this class in json format
     */
    constructor(label: LabelAndDescription);
    /**
     * @returns {LabelAndDescription} the label as json
     */
    toJSON(): LabelAndDescription;
    /**
     * this function checks if two Labels are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the Labels are equal
     */
    equals(other: LabelAndDescription): boolean;
}
//# sourceMappingURL=Label.d.ts.map