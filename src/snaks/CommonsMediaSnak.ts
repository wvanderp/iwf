import { CommonsMediaSnak as WikidataCommonsMediaSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';
import { PString } from '../types/strings';

const dataType = 'commonsMedia';

/**
 * Class for the CommonsMediaSnak
 *
 * Most used property of this type P18 (image)
 *
 * @class
 */
export default class CommonsMediaSnak extends Snak {
    /** the file name as used in the wiki commons url */
    fileName: string | null;

    datatype = dataType;

    /**
     * @param {WikidataCommonsMediaSnak} snak the snak for this class in json format
     * @example
     *    const snak = new CommonsMediaSnak(json);
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
     * @returns {WikidataCommonsMediaSnak} the snak as json
     * @example
     *      const json = CommonsSnak.toJson();
     */
    toJSON(): WikidataCommonsMediaSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.fileName as string,
                type: 'string' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {CommonsMediaSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: CommonsMediaSnak): boolean {
        return this.fileName === other.fileName && this.property === other.property;
    }

    /**
     * create a snak from a property and a file name
     *
     * @static
     * @param {PString} property the property of the snak in 'P-form'
     * @param {string} fileName the file name
     * @returns {CommonsMediaSnak} a snak with the given properties
     * @example
     *   const snak = CommonsMediaSnak.fromFileName('P18', 'Example.jpg');
     */
    static fromFileName(property: PString, fileName: string): CommonsMediaSnak {
        return new CommonsMediaSnak({
            snaktype: 'value',
            property,
            datatype: dataType,
            datavalue: {
                value: fileName,
                type: 'string'
            }
        });
    }
}
