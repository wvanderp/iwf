import { ExternalIdentifierSnak as WikidataExternalIdentifierSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'external-id';

/**
 * Class for the ExternalIdentifierSnak.
 *
 * Most used property of this type is P698 (PubMed ID).
 *
 * @class
 */
export default class ExternalIdentifierSnak extends Snak {
    id: string | null;

    datatype = dataType;

    /**
     * @param {WikidataExternalIdentifierSnak} snak The snak for this class in JSON format.
     * @example
     *    const snak = new ExternalIdentifierSnak(json);
     */
    constructor(snak: WikidataExternalIdentifierSnak) {
        super(snak);

        this.id = snak.datavalue?.value ?? null;
    }

    /**
     * Converts the snak to JSON format.
     *
     * @returns {WikidataExternalIdentifierSnak} The snak as JSON.
     * @example
     *      const json = wikidataExtIDSnak.toJSON();
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
     * Checks if two snaks are equal.
     *
     * @param {ExternalIdentifierSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *   if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: ExternalIdentifierSnak): boolean {
        return this.id === other.id && this.property === other.property;
    }

    /**
     * Creates a snak from a property and an ID string.
     *
     * @static
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {string} id The external identifier.
     * @returns {ExternalIdentifierSnak} A snak with the given properties.
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
