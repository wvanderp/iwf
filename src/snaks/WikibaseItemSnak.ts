import {WikibaseItemSnak as WikidataWikibaseItemSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class WikibaseItemSnak extends Snak {
    numericID: number | undefined

    constructor(snak: WikidataWikibaseItemSnak) {
        super(snak);

        this.numericID = snak.datavalue?.value['numeric-id'];
    }

    public get id() : string| undefined {
        return this.hasValue ? `Q${this.numericID}` : undefined;
    }

    toJSON(): WikidataWikibaseItemSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    'entity-type': 'item' as const,
                    'numeric-id': this.numericID,
                    id: this.id
                },
                type: 'wikibase-entityid' as const
            } : undefined,
            datatype: 'wikibase-item'
        }) as WikidataWikibaseItemSnak;
    }
}
