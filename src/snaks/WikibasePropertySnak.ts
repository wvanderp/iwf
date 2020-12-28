import {WikibasePropertySnak as WikidataWikibasePropertySnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class WikibasePropertySnak extends Snak {
    numericID: number | undefined

    constructor(snak: WikidataWikibasePropertySnak) {
        super(snak);

        this.numericID = snak.datavalue?.value['numeric-id'];
    }

    public get id() : string| undefined {
        return this.hasValue ? `P${this.numericID}` : undefined;
    }

    toJSON(): WikidataWikibasePropertySnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            datavalue: {
                value: {
                    'entity-type': 'property' as const,
                    'numeric-id': this.numericID,
                    id: this.id
                },
                type: 'wikibase-entityid' as const
            },
            datatype: 'wikibase-property' as const
        }) as WikidataWikibasePropertySnak;
    }
}
