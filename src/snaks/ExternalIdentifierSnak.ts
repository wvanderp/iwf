import {ExternalIdentifierSnak as WikidataExternalIdentifierSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class ExternalIdentifierSnak extends Snak {
    id: string | null

    constructor(snak: WikidataExternalIdentifierSnak) {
        super(snak);

        this.id = snak.datavalue?.value ?? null;
    }

    toJSON(): WikidataExternalIdentifierSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.id,
                type: 'string'
            } : undefined,
            datatype: 'external-id'
        }) as WikidataExternalIdentifierSnak;
    }
}
