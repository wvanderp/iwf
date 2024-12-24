import { CommonsMediaSnak as WikidataCommonsMediaSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';
import { PString } from '../types/strings';

const dataType = 'commonsMedia';

/**
 * Class for the CommonsMediaSnak.
 *
 * Most used property of this type is P18 (image).
 *
 * @class
 */
export default class CommonsMediaSnak extends Snak {
    /** The file name as used in the Wiki Commons URL */
    fileName: string | null;

    datatype = dataType;

    /**
     * @param {WikidataCommonsMediaSnak} snak The snak for this class in JSON format.
     * @example
     *    const snak = new CommonsMediaSnak(json);
     */
    constructor(snak: WikidataCommonsMediaSnak) {
        super(snak);

        this.fileName = snak.datavalue?.value ?? null;
    }

    /**
     * Gets the link to the image.
     * Uses the `Special:Redirect` function of Wiki Commons to find the right URL.
     *
     * @returns {string} The link to the image.
     */
    public get imageLink(): string {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.fileName}`;
    }

    /**
     * Gets the link to the Wiki Commons page.
     *
     * @returns {string} The link to the Wiki Commons page.
     */
    public get commonsLink(): string {
        return `https://commons.wikimedia.org/wiki/File:${this.fileName}`;
    }

    /**
     * @returns {WikidataCommonsMediaSnak} The snak as JSON.
     * @example
     *      const json = CommonsSnak.toJSON();
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
     * This function checks if two snaks are equal.
     *
     * @param {CommonsMediaSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: CommonsMediaSnak): boolean {
        return this.fileName === other.fileName && this.property === other.property;
    }

    /**
     * Creates a snak from a property and a file name.
     *
     * @static
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {string} fileName The file name.
     * @returns {CommonsMediaSnak} A snak with the given properties.
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
