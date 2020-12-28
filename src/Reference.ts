import {Reference as WikidataReference, ReferenceSnaks as wikidataReferenceSnaks} from '@wmde/wikibase-datamodel-types';
import Snak from './Snak';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';

export default class Reference {
    hash: string;

    snaksOrder: string[] | undefined;

    snaks: Snak[];

    constructor(reference: WikidataReference) {
        this.hash = reference.hash;
        this.snaksOrder = reference['snaks-order'];

        this.snaks = Object.values(reference.snaks)
            .flat()
            .map((snak) => snakGenerator(snak));
    }

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
}
