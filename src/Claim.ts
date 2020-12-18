import {Statement as wikidataClaim, Qualifiers as wikidataQualifiers} from '@wmde/wikibase-datamodel-types';
import Reference from './Reference';
import Snak from './Snak';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';

export default class Claim {
    id: string | undefined;

    type: 'statement'

    rank: 'normal' | 'preferred' | 'deprecated'

    mainsnak: Snak;

    references: Reference[];

    qualifiers: Snak[];

    qualifiersOrder: string[]

    constructor(claim: wikidataClaim) {
        this.id = claim.id;
        this.type = claim.type;

        this.qualifiers = Object.values(claim.qualifiers ?? {})
            .flat()
            .map((snak) => snakGenerator(snak));

        this.qualifiersOrder = claim['qualifiers-order'] ?? [];

        this.rank = claim.rank;
        this.mainsnak = snakGenerator(claim.mainsnak);
        this.references = claim.references
            ? Object.values(claim.references).map((reference) => new Reference(reference))
            : [];
    }

    toJSON(): wikidataClaim {
        const references = this.references.map((reference) => reference.toJSON());
        const qualifiers = this.qualifiers
            .map((qualifier) => qualifier.toJSON())
            .reduce<wikidataQualifiers>(
                (accumulator, value) => {
                    if (accumulator[value.property] === undefined) {
                        accumulator[value.property] = [];
                    }

                    accumulator[value.property].push(value);

                    return accumulator;
                },
                {}
            );

        return normalizeOutput({
            mainsnak: this.mainsnak.toJSON(),
            type: this.type,
            qualifiers: Object.keys(qualifiers).length === 0 ? undefined : qualifiers,
            'qualifiers-order': this.qualifiersOrder.length === 0 ? undefined : this.qualifiersOrder,
            id: this.id,
            rank: this.rank,
            references: references.length === 0 ? undefined : references
        }) as wikidataClaim;
    }
}
