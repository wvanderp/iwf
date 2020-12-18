import {MusicalNotationSnak as WikidataMusicalNotationSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class MusicalNotationSnak extends Snak {
    value: string | undefined

    constructor(snak: WikidataMusicalNotationSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    toJSON(): WikidataMusicalNotationSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: 'musical-notation'
        }) as WikidataMusicalNotationSnak;
    }
}
