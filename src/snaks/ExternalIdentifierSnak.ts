import { ExternalIdentifierSnak as WikidataExternalIdentifierSnak } from '@wmde/wikibase-datamodel-types';
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
    id: string | null;

    datatype = 'external-id';

    /**
     * @param {WikidataExternalIdentifierSnak} snak the snak for this class in json format
     * @example
     */
    constructor(snak: WikidataExternalIdentifierSnak) {
        super(snak);

        this.id = snak.datavalue?.value ?? null;
    }

    /**
     * @param {boolean} isMediainfo where to output for the mediainfo type, this changes some of the json output
     * @returns {WikidataExternalIdentifierSnak} the snak as json
     * @example
     */
    toJSON(isMediainfo = false): WikidataExternalIdentifierSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.id,
                type: 'string'
            } : undefined,
            datatype: isMediainfo ? undefined : this.datatype
        }) as WikidataExternalIdentifierSnak;
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {ExternalIdentifierSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     */
    equals(other: ExternalIdentifierSnak): boolean {
        return this.id === other.id;
    }

    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} id the external identifier
     * @returns {ExternalIdentifierSnak} a snak with the given properties
     * @example
     */
    static fromID(property: string, id: string): ExternalIdentifierSnak {
        return new ExternalIdentifierSnak({
            snaktype: 'value',
            property,
            datatype: 'external-id',
            datavalue: {
                value: id,
                type: 'string'
            }
        });
    }
}
