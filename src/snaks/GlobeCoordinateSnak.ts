import {GlobeCoordinateSnak as WikidataGlobeCoordinateSnak} from '@wmde/wikibase-datamodel-types';
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
    latitude: number | undefined

    /** the longitude of the Coordinate */
    longitude: number| undefined

    /** the altitude of the Coordinate */
    altitude: null| undefined

    /** the precision of the Coordinate */
    precision: number| undefined

    /**
     * the "globe" that this coordinate refers to.
     * Globe defaults to "Earth" (globe: http://www.wikidata.org/entity/Q2)
     */
    globe: string| undefined

    datatype = 'globe-coordinate';

    /**
     * @param {WikidataGlobeCoordinateSnak} snak the snak for this class in json format
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
     */
    toJSON(): WikidataGlobeCoordinateSnak {
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
            datatype: this.datatype
        }) as WikidataGlobeCoordinateSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {GlobeCoordinateSnak} a snak a
     * @param {GlobeCoordinateSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a:GlobeCoordinateSnak, b:GlobeCoordinateSnak): boolean {
        return a.latitude === b.latitude
        && a.longitude === b.longitude
        && a.altitude === b.altitude
        && a.precision === b.precision
        && a.globe === b.globe;
    }
}
