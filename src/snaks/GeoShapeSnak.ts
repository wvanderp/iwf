import { GeoShapeSnak as WikidataGeoShapeSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'geo-shape';

/**
 * Class for the GeoShapeSnak.
 *
 * Most used property of this type is P3896 (geoshape).
 *
 * @class
 */
export default class GeoShapeSnak extends Snak {
    /** The Wikimedia Commons file name */
    fileName: string | null;

    datatype = dataType;

    /**
     * @param {WikidataGeoShapeSnak} snak The snak for this class in JSON format.
     * @example
     *   const snak = new GeoShapeSnak(json);
     */
    constructor(snak: WikidataGeoShapeSnak) {
        super(snak);

        this.fileName = snak.datavalue?.value ?? null;
    }

    /**
     * Gets the link to the Wikimedia Commons page.
     *
     * @returns {string} The link to the Wikimedia Commons page.
     */
    public get commonsLink(): string {
        return `https://commons.wikimedia.org/wiki/${this.fileName}`;
    }

    /**
     * Converts the snak to JSON format.
     *
     * @returns {WikidataGeoShapeSnak} The snak as JSON.
     * @example
     *      const json = geoShapeSnak.toJSON();
     */
    toJSON(): WikidataGeoShapeSnak {
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
     * Checks if two snaks are equal.
     *
     * @param {GeoShapeSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: GeoShapeSnak): boolean {
        return this.fileName === other.fileName && this.property === other.property;
    }
}
