import { Reference as WikidataReference } from '@wmde/wikibase-datamodel-types';
import Snak from './Snak';
/**
 * A class for References
 *
 * @class
 */
export default class Reference {
    /** A ID for using things that don't have an ID */
    internalID: string;
    hash: string;
    snaksOrder: string[] | undefined;
    snaks: Snak[];
    /**
     *
     * @param {WikidataReference} reference the Reference in json format
     */
    constructor(reference: WikidataReference);
    /**
     * @returns {WikidataReference} the Reference in a json format
     */
    toJSON(): WikidataReference;
}
//# sourceMappingURL=Reference.d.ts.map