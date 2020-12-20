import { GlobeCoordinateSnak as WikidataGlobeCoordinateSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class GlobeCoordinateSnak extends Snak {
    latitude: number | undefined;
    longitude: number | undefined;
    altitude: null | undefined;
    precision: number | undefined;
    globe: string | undefined;
    constructor(snak: WikidataGlobeCoordinateSnak);
    toJSON(): WikidataGlobeCoordinateSnak;
}
//# sourceMappingURL=GlobeCoordinateSnak.d.ts.map