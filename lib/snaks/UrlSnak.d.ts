import { URLSnak as WikidataURLSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
export default class URLSnak extends Snak {
    value: string | undefined;
    datatype: string;
    constructor(snak: WikidataURLSnak);
    toJSON(): WikidataURLSnak;
}
//# sourceMappingURL=UrlSnak.d.ts.map