import { GlobeCoordinateSnak as WikidataGlobeCoordinateSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the GlobeCoordinateSnak
 *
 * most used property of this type P625 (coordinate location)
 *
 * @class
 */
export default class GlobeCoordinateSnak extends Snak {
    /** the latitude of the Coordinate */
    latitude: number | undefined;

    /** the longitude of the Coordinate */
    longitude: number | undefined;

    /** the altitude of the Coordinate */
    altitude: null | undefined;

    /** the precision of the Coordinate */
    precision: number | undefined;

    /**
     * the "globe" that this coordinate refers to.
     * Globe defaults to "Earth" (globe: http://www.wikidata.org/entity/Q2)
     */
    globe: string | undefined;

    datatype = 'globe-coordinate';

    /**
     * @param {WikidataGlobeCoordinateSnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataGlobeCoordinateSnak) {
        super(snak);

        this.latitude = snak.datavalue?.value.latitude;
        this.longitude = snak.datavalue?.value.longitude;
        this.altitude = snak.datavalue?.value.altitude;
        this.precision = snak.datavalue?.value.precision;
        this.globe = snak.datavalue?.value.globe;
    }

    /**
     * @param {boolean} isMediainfo where to output for the mediainfo type, this changes some of the json output
     * @returns {WikidataGlobeCoordinateSnak} the snak as json
     * @example
     */
    toJSON(isMediainfo = false): WikidataGlobeCoordinateSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    altitude: this.altitude,
                    precision: this.precision,
                    globe: this.globe
                },
                type: 'globecoordinate' as const
            } : undefined,
            datatype: isMediainfo ? undefined : this.datatype
        }) as WikidataGlobeCoordinateSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {GlobeCoordinateSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: GlobeCoordinateSnak): boolean {
        return this.latitude === other.latitude
            && this.longitude === other.longitude
            && this.altitude === other.altitude
            && this.precision === other.precision
            && this.globe === other.globe;
    }
}
