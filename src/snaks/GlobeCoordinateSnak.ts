import { GlobeCoordinateSnak as WikidataGlobeCoordinateSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'globe-coordinate';

/**
 * Class for the GlobeCoordinateSnak
 *
 * Most used property of this type P625 (coordinate location)
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

    datatype = dataType;

    /**
     * @param {WikidataGlobeCoordinateSnak} snak the snak for this class in json format
     * @example
     *   const snak = new GlobeCoordinateSnak(json);
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
     *
     * @returns {WikidataGlobeCoordinateSnak} the snak as json
     * @example
     *      const json = coordinateSnak.toJson();
     */
    toJSON(): WikidataGlobeCoordinateSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    latitude: this.latitude as number,
                    longitude: this.longitude as number,
                    altitude: this.altitude as null,
                    precision: this.precision as number,
                    globe: this.globe as string
                },
                type: 'globecoordinate' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {GlobeCoordinateSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: GlobeCoordinateSnak): boolean {
        return this.latitude === other.latitude
            && this.longitude === other.longitude
            && this.altitude === other.altitude
            && this.precision === other.precision
            && this.globe === other.globe
            && this.property === other.property;
    }
}
