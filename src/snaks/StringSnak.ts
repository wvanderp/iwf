import {StringSnak as WikidataStringSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class StringSnak extends Snak {
    value: string| undefined

    constructor(snak: WikidataStringSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    toJSON(): WikidataStringSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: 'string'
        }) as WikidataStringSnak;
    }
}
