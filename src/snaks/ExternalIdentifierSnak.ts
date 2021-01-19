import {ExternalIdentifierSnak as WikidataExternalIdentifierSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the ExternalIdentifierSnak
 *
 * most used property of this type P698 (PubMed ID)
 *
 * @class
 */
export default class ExternalIdentifierSnak extends Snak {
    id: string | null

    datatype = 'external-id';

    /**
     * @param {WikidataExternalIdentifierSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataExternalIdentifierSnak) {
        super(snak);

        this.id = snak.datavalue?.value ?? null;
    }

    /**
     *
     * @returns {WikidataExternalIdentifierSnak} the snak as json
     */
    toJSON(): WikidataExternalIdentifierSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.id,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataExternalIdentifierSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @static
     * @param {ExternalIdentifierSnak} a snak a
     * @param {ExternalIdentifierSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a:ExternalIdentifierSnak, b:ExternalIdentifierSnak): boolean {
        return a.id === b.id;
    }
}
