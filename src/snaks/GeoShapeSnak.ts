import { GeoShapeSnak as WikidataGeoShapeSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'geo-shape';

/**
 * Class for the GeoShapeSnak
 *
 * Most used property of this type P3896 (geoshape)
 *
 * @class
 */
export default class GeoShapeSnak extends Snak {
    /** the wiki commons file name */
    fileName: string | null;

    datatype = dataType;

    /**
     * @param {WikidataGeoShapeSnak} snak the snak for this class in json format
     * @example
     *   const snak = new GeoShapeSnak(json);
     */
    constructor(snak: WikidataGeoShapeSnak) {
        super(snak);

        this.fileName = snak.datavalue?.value ?? null;
    }

    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    public get commonsLink(): string {
        return `https://commons.wikimedia.org/wiki/${this.fileName}`;
    }

    /**
     *
     * @returns {WikidataGeoShapeSnak} the snak as json
     * @example
     *      const json = geoShapeSnak.toJson();
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
     * this function checks if two snaks are equal
     *
     * @param {GeoShapeSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: GeoShapeSnak): boolean {
        return this.fileName === other.fileName && this.property === other.property;
    }
}
