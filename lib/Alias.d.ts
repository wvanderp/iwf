import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
/**
 * class for aliases
 *
 * @class
 */
export default class Alias {
    /** A ID for using things that don't have an ID */
    internalID: string;
    /** the language of the alias */
    language: string;
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
     * this function checks if two aliases are equal
     *
     * @static
     * @param {LabelAndDescription} a Alias a
     * @param {LabelAndDescription} b Alias b
     * @returns {boolean} true if the aliases are equal
     */
    static equals(a: LabelAndDescription, b: LabelAndDescription): boolean;
}
//# sourceMappingURL=Alias.d.ts.map