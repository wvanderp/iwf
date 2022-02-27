import { CommonsMediaSnak as WikidataCommonsMediaSnak } from '@wmde/wikibase-datamodel-types';
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
    fileName: string | null;

    datatype = 'commonsMedia';

    /**
     * @param {WikidataCommonsMediaSnak} snak the snak for this class in json format
     * @example
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
    public get imageLink(): string {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.fileName}`;
    }

    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    public get commonsLink(): string {
        return `https://commons.wikimedia.org/wiki/File:${this.fileName}`;
    }

    /**
     *
     * @param {boolean} isMediainfo where to output for the mediainfo type, this changes some of the json output
     * @returns {WikidataCommonsMediaSnak} the snak as json
     * @example
     */
    toJSON(isMediainfo = false): WikidataCommonsMediaSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.fileName,
                type: 'string'
            } : undefined,
            datatype: isMediainfo ? undefined : this.datatype
        }) as WikidataCommonsMediaSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {CommonsMediaSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: CommonsMediaSnak): boolean {
        return this.fileName === other.fileName;
    }
}
