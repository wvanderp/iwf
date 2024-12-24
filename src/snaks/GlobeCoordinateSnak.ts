import { GlobeCoordinateSnak as WikidataGlobeCoordinateSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'globe-coordinate';

/**
 * Class for the GlobeCoordinateSnak.
 *
 * Most used property of this type is P625 (coordinate location).
 *
 * @class
 */
export default class GlobeCoordinateSnak extends Snak {
    /** The latitude of the Coordinate */
    latitude: number | undefined;

    /** The longitude of the Coordinate */
    longitude: number | undefined;

    /** The altitude of the Coordinate */
    altitude: null | undefined;

    /** The precision of the Coordinate */
    precision: number | undefined;

    /**
     * The "globe" that this coordinate refers to.
     * Globe defaults to "Earth" (globe: http://www.wikidata.org/entity/Q2).
     */
    globe: string | undefined;

    datatype = dataType;

    /**
     * @param {WikidataGlobeCoordinateSnak} snak The snak for this class in JSON format.
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
     * @returns {WikidataGlobeCoordinateSnak} The snak as JSON.
     * @example
     *      const json = globeCoordinateSnak.toJSON();
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
     * This function checks if two snaks are equal.
     *
     * @param {GlobeCoordinateSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
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
