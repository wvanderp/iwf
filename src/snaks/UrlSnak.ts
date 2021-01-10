import {URLSnak as WikidataURLSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class URLSnak extends Snak {
    value: string | undefined;

    datatype = 'url';

    constructor(snak: WikidataURLSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    toJSON(): WikidataURLSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataURLSnak;
    }
}
