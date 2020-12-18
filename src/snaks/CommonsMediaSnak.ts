import {CommonsMediaSnak as WikidataCommonsMediaSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

export default class CommonsMediaSnak extends Snak {
    fileName : string | null

    constructor(snak: WikidataCommonsMediaSnak) {
        super(snak);

        this.fileName = snak.datavalue?.value ?? null;
    }

    public get imageLink() : string {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.fileName}`;
    }

    public get commonsLink() : string {
        return `https://commons.wikimedia.org/wiki/File:${this.fileName}`;
    }

    toJSON(): WikidataCommonsMediaSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.fileName,
                type: 'string'
            } : undefined,
            datatype: 'commonsMedia'
        }) as WikidataCommonsMediaSnak;
    }
}
