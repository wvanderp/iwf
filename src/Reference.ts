import {Reference as WikidataReference, ReferenceSnaks as wikidataReferenceSnaks} from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import Snak from './Snak';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';

/**
 * A class for References
 *
 * @class
 */
export default class Reference {
    /** A ID for using things that don't have an ID */
    internalID: string;

    hash: string | undefined;

    snaksOrder: string[] | undefined;

    snaks: Snak[];

    /**
     *
     * @param {WikidataReference} reference the Reference in json format
     */
    constructor(reference: WikidataReference) {
        this.hash = reference.hash;
        this.snaksOrder = reference['snaks-order'];
        this.internalID = uuidv4();

        this.snaks = Object.values(reference.snaks)
            .flat()
            .map((snak) => snakGenerator(snak));
    }

    /**
     * @returns {WikidataReference} the Reference in a json format
     */
    toJSON(): WikidataReference {
        return normalizeOutput({
            hash: this.hash,
            snaks: this.snaks
                .map((snak) => snak.toJSON())
                .reduce<wikidataReferenceSnaks>(
                    (accumulator, value) => {
                        if (accumulator[value.property] === undefined) {
                            accumulator[value.property] = [];
                        }

                        accumulator[value.property].push(value);
                        return accumulator;
                    },
                    {}
                ),
            'snaks-order': this.snaksOrder
        });
    }

    /**
     * creates a new reference from snaks
     *
     * @static
     * @param {Snak} snaks the snaks for the reference
     * @returns {Reference} the reference objects
     */
    static fromSnaks(snaks: Snak[]) : Reference {
        return new Reference({
            snaks: snaks
                .map((snak) => snak.toJSON())
                .reduce<wikidataReferenceSnaks>(
                    (accumulator, value) => {
                        if (accumulator[value.property] === undefined) {
                            accumulator[value.property] = [];
                        }

                        accumulator[value.property].push(value);
                        return accumulator;
                    },
                    {}
                )
        });
    }
}
