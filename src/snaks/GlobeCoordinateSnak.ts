import {GlobeCoordinateSnak as WikidataGlobeCoordinateSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class GlobeCoordinateSnak extends Snak {
    latitude: number | undefined

    longitude: number| undefined

     altitude: null| undefined

     precision: number| undefined

     globe: string| undefined

     constructor(snak: WikidataGlobeCoordinateSnak) {
         super(snak);

         this.latitude = snak.datavalue?.value.latitude;
         this.longitude = snak.datavalue?.value.longitude;
         this.altitude = snak.datavalue?.value.altitude;
         this.precision = snak.datavalue?.value.precision;
         this.globe = snak.datavalue?.value.globe;
     }

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
             datatype: 'globe-coordinate'
         }) as WikidataGlobeCoordinateSnak;
     }
}
