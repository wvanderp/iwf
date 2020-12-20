import { GeoShapeSnak as WikidataGeoShapeSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class GeoShapeSnak extends Snak {
    fileName: string | null;
    constructor(snak: WikidataGeoShapeSnak);
    get commonsLink(): string;
    toJSON(): WikidataGeoShapeSnak;
}
//# sourceMappingURL=GeoShapeSnak.d.ts.map