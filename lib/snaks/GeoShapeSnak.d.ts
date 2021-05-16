import { GeoShapeSnak as WikidataGeoShapeSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
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
    datatype: string;
    /**
     * @param {WikidataGeoShapeSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataGeoShapeSnak);
    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    get commonsLink(): string;
    /**
     *
     * @returns {WikidataGeoShapeSnak} the snak as json
     */
    toJSON(): WikidataGeoShapeSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {GeoShapeSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: GeoShapeSnak): boolean;
}
//# sourceMappingURL=GeoShapeSnak.d.ts.map