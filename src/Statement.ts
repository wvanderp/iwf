import { Statement as wikidataStatement, Qualifiers as wikidataQualifiers } from '@wmde/wikibase-datamodel-types';
import { createHash } from 'crypto';

import Reference from './Reference';
import Snak from './Snak';
import { Snaks } from './types/SnaksType';
import { PString } from './types/strings';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import normalizeOutput from './utils/normalizeOutput';
import snakGenerator from './utils/snakGenerator';

/**
 * @class
 */
export default class Statement {
    /** a place to store the internalID so that it does not change if the contents of the object changes */
    private _internalID = '';

    id: string | undefined;

    type: 'statement';

    rank: 'normal' | 'preferred' | 'deprecated';

    mainsnak: Snaks;

    references: Reference[];

    qualifiers: Snak[];

    qualifiersOrder: string[];

    /**
     *
     * @param {wikidataStatement} statement the statement in a json format
     * @example
     *     const statement = new Statement(json);
     */
    constructor(statement: wikidataStatement) {
        this.id = statement.id;
        this.type = statement.type;

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
     * gets the unique hash of the statement
     *
     * @returns {string} the id
     */
    public get internalID(): string {
        if (this._internalID === '') {
            this._internalID = createHash('sha256')
                .update(JSON.stringify(this.toJSON()))
                .digest('hex');
        }

        return this._internalID;
    }

    /**
     * gets the property of the statement
     *
     * @returns {PString | undefined} the property of the statement
     * @example
     * const property = statement.property;
     */
    public get property(): PString | undefined {
        return this.mainsnak.property;
    }

    /**
     * @returns {wikidataStatement} the statement in a json format
     * @example
     *      const json = statement.toJson();
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
     * @example
     *  const statement = Statement.fromSnak(snak);
     */
    static fromSnak(snak: Snak): Statement {
        return new Statement({
            mainsnak: snak.toJSON(),
            type: 'statement',
            rank: 'normal'
        });
    }

    /**
     *
     * @param {Statement} other the other statement
     * @returns {boolean} if the two statements are equal
     * @example
     *   if (statement1.equals(statement2)) {
     *      // do something
     *   }
     */
    equals(other: Statement): boolean {
        const idEqual = this.id === other.id;
        const typeEqual = this.type === other.type;
        const rankEqual = this.rank === other.rank;
        const qualifiersOrderEqual = arrayEqual(this.qualifiersOrder, other.qualifiersOrder);
        // @ts-expect-error
        const snakEqual = this.mainsnak.datatype === other.mainsnak.datatype && this.mainsnak.equals(other.mainsnak);
        const referencesEqual = arrayEqualWith(
            this.references,
            other.references,
            (a: Reference, b: Reference) => a.equals(b)
        );
        const qualifiersEqual = arrayEqualWith(this.qualifiers, other.qualifiers, (a: Snak, b: Snak) => a.equals(b));

        return idEqual
            && typeEqual
            && rankEqual
            && qualifiersOrderEqual
            && snakEqual
            && referencesEqual
            && qualifiersEqual;
    }
}
