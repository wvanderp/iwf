import {GeoShapeSnak as WikidataGeoShapeSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class GeoShapeSnak extends Snak {
    fileName : string | null

    datatype = 'geo-shape';

    constructor(snak: WikidataGeoShapeSnak) {
        super(snak);

        this.fileName = snak.datavalue?.value ?? null;
    }

    public get commonsLink() : string {
        return `https://commons.wikimedia.org/wiki/${this.fileName}`;
    }

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
}
