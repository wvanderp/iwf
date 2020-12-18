import {TabularDataSnak as WikidataTabularDataSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class TabularDataSnak extends Snak {
    value: string | undefined

    constructor(snak: WikidataTabularDataSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    toJSON(): WikidataTabularDataSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: 'tabular-data'
        }) as WikidataTabularDataSnak;
    }
}
