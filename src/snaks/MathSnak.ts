import {MathSnak as WikidataMathSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class MathSnak extends Snak {
    value: string | undefined

    datatype = 'math';

    constructor(snak: WikidataMathSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    toJSON(): WikidataMathSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataMathSnak;
    }
}
