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
     * this function checks if two labels are equal
     *
     * @static
     * @param {LabelAndDescription} a Label a
     * @param {LabelAndDescription} b Label b
     * @returns {boolean} true if the items are equal
     */
    static equals(a: LabelAndDescription, b: LabelAndDescription): boolean;
}
//# sourceMappingURL=Label.d.ts.map