import { ExternalIdentifierSnak as WikidataExternalIdentifierSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'external-id';

/**
 * Class for the ExternalIdentifierSnak
 *
 * Most used property of this type P698 (PubMed ID)
 *
 * @class
 */
export default class ExternalIdentifierSnak extends Snak {
    id: string | null;

    datatype = dataType;

    /**
     * @param {WikidataExternalIdentifierSnak} snak the snak for this class in json format
     * @example
     *    const snak = new ExternalIdentifierSnak(json);
     */
    constructor(snak: WikidataExternalIdentifierSnak) {
        super(snak);

        this.id = snak.datavalue?.value ?? null;
    }

    /**
     *
     * @returns {WikidataExternalIdentifierSnak} the snak as json
     * @example
     *      const json = wikidataExtIDSnak.toJson();
     */
    toJSON(): WikidataExternalIdentifierSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.id as string,
                type: 'string' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {ExternalIdentifierSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: ExternalIdentifierSnak): boolean {
        return this.id === other.id && this.property === other.property;
    }

    /**
     * create a snak from a property and a id string
     *
     * @static
     * @param {PString} property the property of the snak in 'P-form'
     * @param {string} id the external identifier
     * @returns {ExternalIdentifierSnak} a snak with the given properties
     * @example
     *   const snak = ExternalIdentifierSnak.fromID('P698', '12345678');
     */
    static fromID(property: PString, id: string): ExternalIdentifierSnak {
        return new ExternalIdentifierSnak({
            snaktype: 'value',
            property,
            datatype: dataType,
            datavalue: {
                value: id,
                type: 'string'
            }
        });
    }
}
