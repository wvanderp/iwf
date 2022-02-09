import { GeoShapeSnak as WikidataGeoShapeSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the GeoShapeSnak
 *
 * most used property of this type P3896 (geoshape)
 *
 * @class
 */
export default class GeoShapeSnak extends Snak {
    /** the wiki commons file name */
    fileName: string | null;

    datatype = 'geo-shape';

    /**
     * @param {WikidataGeoShapeSnak} snak the snak for this class in json format
     * @example
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
     */
    toJSON(): WikidataGeoShapeSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.fileName,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataGeoShapeSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {GeoShapeSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: GeoShapeSnak): boolean {
        return this.fileName === other.fileName;
    }
}
