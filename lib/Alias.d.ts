import { LabelAndDescription, LabelLanguages } from '@wmde/wikibase-datamodel-types';
/**
 * class for aliases
 *
 * @class
 */
export default class Alias {
    /** A ID for using things that don't have an ID */
    internalID: string;
    /** the language of the alias */
    language: LabelLanguages;
    /** the value of the alias */
    value: string;
    /**
     *
     * @param {LabelAndDescription} alias  the alias in json format
     */
    constructor(alias: LabelAndDescription);
    /**
     * @returns {LabelAndDescription} the alias in a json format
     */
    toJSON(): LabelAndDescription;
    /**
     * this function checks if two Aliases are equal
     *
     * @param {LabelAndDescription} other the other Label
     * @returns {boolean} true if the Aliases are equal
     */
    equals(other: LabelAndDescription): boolean;
}
//# sourceMappingURL=Alias.d.ts.map