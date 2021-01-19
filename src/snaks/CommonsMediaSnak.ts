import {CommonsMediaSnak as WikidataCommonsMediaSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the CommonsMediaSnak
 *
 * most used property of this type P18 (image)
 *
 * @class
 */
export default class CommonsMediaSnak extends Snak {
    /** the file name as used in the wiki commons url */
    fileName : string | null

    datatype = 'commonsMedia';

    /**
     * @param {WikidataCommonsMediaSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataCommonsMediaSnak) {
        super(snak);

        this.fileName = snak.datavalue?.value ?? null;
    }

    /**
     * gets the link to the image.
     * uses the special:redirect function of wiki commons to find the right url
     *
     * @returns {string} the link to the image
     */
    public get imageLink() : string {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.fileName}`;
    }

    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    public get commonsLink() : string {
        return `https://commons.wikimedia.org/wiki/File:${this.fileName}`;
    }

    /**
     *
     * @returns {WikidataCommonsMediaSnak} the snak as json
     */
    toJSON(): WikidataCommonsMediaSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.fileName,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataCommonsMediaSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {CommonsMediaSnak} a snak a
     * @param {CommonsMediaSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a:CommonsMediaSnak, b:CommonsMediaSnak): boolean {
        return a.fileName === b.fileName;
    }
}
