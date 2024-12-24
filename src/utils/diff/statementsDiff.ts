import {
    Statement as wikidataStatement
} from '@wmde/wikibase-datamodel-types';
import diffArray from 'diff-arrays-of-objects';

import Statement from '../../Statement';
import { Change } from './Change';
import { QString } from '../../types/strings';

export interface StatementChange extends Change {
    type: 'statement',
    action: 'add' | 'remove' | 'update';
    parentID: QString | 'unknown';
    old?: wikidataStatement;
    new?: wikidataStatement;
}

/**
 * Finds the added, removed, and changed statements between two arrays.
 *
 * @private
 * @param {Statement[]} o The old array.
 * @param {Statement[]} n The new array.
 * @param {QString | 'unknown'} parentID The ID of the parent of both the old and the new array.
 * @returns {StatementChange[]} The changes from the old array to the new array.
 */
export default function statementDiff(o: Statement[], n: Statement[], parentID: QString | 'unknown'): StatementChange[] {
    const { added, updated, removed } = diffArray(
        o,
        n,
        'internalID',
        {
            compareFunction: (a: Statement, b: Statement) => (a.equals(b)),
            updatedValues: diffArray.updatedValues.both
        }
    );

    const deletedChanges = removed.map((c) => ({
        action: 'remove' as const,
        parentID,
        type: 'statement' as const,
        old: c.toJSON()
    }));

    const addedChanges = added.map((c) => ({
        action: 'add' as const,
        parentID,
        type: 'statement' as const,
        new: c.toJSON()
    }));

    const updatedChanges = updated.map((c) => ({
        action: 'update' as const,
        parentID,
        type: 'statement' as const,
        old: c[0].toJSON(),
        new: c[1].toJSON()
    }));

    return [...addedChanges, ...updatedChanges, ...deletedChanges];
}
