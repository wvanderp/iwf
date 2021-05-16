import { ExternalIdentifierSnak as WikidataExternalIdentifierSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * class for the ExternalIdentifierSnak
 *
 * most used property of this type P698 (PubMed ID)
 *
 * @class
 */
export default class ExternalIdentifierSnak extends Snak {
    id: string | null;
    datatype: string;
    /**
     * @param {WikidataExternalIdentifierSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataExternalIdentifierSnak);
    /**
     *
     * @returns {WikidataExternalIdentifierSnak} the snak as json
     */
    toJSON(): WikidataExternalIdentifierSnak;
    /**
     * this function checks if two snaks are equal
     *
     * @param {ExternalIdentifierSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     */
    equals(other: ExternalIdentifierSnak): boolean;
    /**
     * @static
     * @param {string} property the property of the snak in 'P-form'
     * @param {string} id the external identifier
     * @returns {ExternalIdentifierSnak} a snak with the given properties
     */
    static fromID(property: string, id: string): ExternalIdentifierSnak;
}
//# sourceMappingURL=ExternalIdentifierSnak.d.ts.map