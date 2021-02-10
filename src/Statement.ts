import {Statement as wikidataStatement, Qualifiers as wikidataQualifiers} from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import Reference from './Reference';
import Snak from './Snak';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';

/**
 * @class
 */
export default class Statement {
    /** A ID for using things that don't have an ID */
    internalID: string;

    id: string | undefined;

    type: 'statement'

    rank: 'normal' | 'preferred' | 'deprecated'

    mainsnak: Snak;

    references: Reference[];

    qualifiers: Snak[];

    qualifiersOrder: string[]

    /**
     *
     * @param {wikidataStatement} statement the statement in a json format
     */
    constructor(statement: wikidataStatement) {
        this.id = statement.id;
        this.type = statement.type;

        this.internalID = uuidv4();

        this.qualifiers = Object.values(statement.qualifiers ?? {})
            .flat()
            .map((snak) => snakGenerator(snak));

        this.qualifiersOrder = statement['qualifiers-order'] ?? [];

        this.rank = statement.rank;
        this.mainsnak = snakGenerator(statement.mainsnak);
        this.references = statement.references
            ? Object.values(statement.references).map((reference) => new Reference(reference))
            : [];
    }

    /**
     * @returns {wikidataStatement} the statement in a json format
     */
    toJSON(): wikidataStatement {
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
        }) as wikidataStatement;
    }

    /**
     * creates a statement from a snak
     *
     * @param {Snak} snak the snak for the statement
     * @returns {Statement} the statement
     */
    static fromSnak(snak: Snak): Statement {
        return new Statement({
            mainsnak: snak.toJSON(),
            type: 'statement',
            rank: 'normal'
        });
    }
}
