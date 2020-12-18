import {MonolingualTextSnak as WikidataMonolingualTextSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class MonolingualTextSnak extends Snak {
    text: string | undefined

    language: string | undefined

    constructor(snak: WikidataMonolingualTextSnak) {
        super(snak);

        this.language = snak.datavalue?.value.language;
        this.text = snak.datavalue?.value.text;
    }

    toJSON(): WikidataMonolingualTextSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    text: this.text,
                    language: this.language
                },
                type: 'monolingualtext'
            } : undefined,
            datatype: 'monolingualtext'
        }) as WikidataMonolingualTextSnak;
    }
}
