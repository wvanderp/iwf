import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import diffArray from 'diff-arrays-of-objects';
import { QString } from '../../types/strings';
import Alias from '../../Alias';
import { Change } from './Change';

export interface AliasChange extends Change {
    type: 'alias',
    action: 'add' | 'remove' | 'update';
    parentID: QString | 'unknown';
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * finds the added, removed, and changed aliases between two Arrays
 *
 * @private
 * @param {Alias[]} o the old array
 * @param {Alias[]} n the new array
 * @param {QString | 'unknown'} parentID the ID of the parent of both the old and the new array
 * @returns {AliasChange[]} the changes from the old array to the new array
 */
export default function aliasDiff(o: Alias[], n: Alias[], parentID: QString | 'unknown'): AliasChange[] {
    const { added, updated, removed } = diffArray(
        o,
        n,
        'language',
        {
            compareFunction: (a: Alias, b: Alias) => (a.equals(b)),
            updatedValues: diffArray.updatedValues.both
        }
    );

    const deletedChanges = removed.map((c) => ({
        action: 'remove' as const,
        parentID,
        type: 'alias' as const,
        old: c.toJSON()
    }));

    const addedChanges = added.map((c) => ({
        action: 'add' as const,
        parentID,
        type: 'alias' as const,
        new: c.toJSON()
    }));

    const updatedChanges = updated.map((c) => ({
        action: 'update' as const,
        parentID,
        type: 'alias' as const,
        old: c[0].toJSON(),
        new: c[1].toJSON()
    }));

    return [...addedChanges, ...updatedChanges, ...deletedChanges];
}
