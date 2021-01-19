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
     * @static
     * @param {ExternalIdentifierSnak} a snak a
     * @param {ExternalIdentifierSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a: ExternalIdentifierSnak, b: ExternalIdentifierSnak): boolean;
}
//# sourceMappingURL=ExternalIdentifierSnak.d.ts.map