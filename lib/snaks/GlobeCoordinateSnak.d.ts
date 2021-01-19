import { GlobeCoordinateSnak as WikidataGlobeCoordinateSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
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
    datatype: string;
    /**
     * @param {WikidataGlobeCoordinateSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataGlobeCoordinateSnak);
    /**
     *
     * @returns {WikidataGlobeCoordinateSnak} the snak as json
     */
    toJSON(): WikidataGlobeCoordinateSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {GlobeCoordinateSnak} a snak a
     * @param {GlobeCoordinateSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: GlobeCoordinateSnak, b: GlobeCoordinateSnak): boolean;
}
//# sourceMappingURL=GlobeCoordinateSnak.d.ts.map