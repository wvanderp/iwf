import { CommonsMediaSnak as WikidataCommonsMediaSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the CommonsMediaSnak
 *
 * most used property of this type P18 (image)
 *
 * @class
 */
export default class CommonsMediaSnak extends Snak {
    /** the file name as used in the wiki commons url */
    fileName: string | null;
    datatype: string;
    /**
     * @param {WikidataCommonsMediaSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataCommonsMediaSnak);
    /**
     * gets the link to the image.
     * uses the special:redirect function of wiki commons to find the right url
     *
     * @returns {string} the link to the image
     */
    get imageLink(): string;
    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    get commonsLink(): string;
    /**
     *
     * @returns {WikidataCommonsMediaSnak} the snak as json
     */
    toJSON(): WikidataCommonsMediaSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {CommonsMediaSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: CommonsMediaSnak): boolean;
}
//# sourceMappingURL=CommonsMediaSnak.d.ts.map