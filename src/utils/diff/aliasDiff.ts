import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import diffArray from 'diff-arrays-of-objects';

import { Alias } from '../..';
import { Change } from './Change';

export interface AliasChange extends Change {
    type: 'alias',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * finds the added, removed, and changed aliases between two Arrays
 *
 * @param {Alias[]} o the old array
 * @param {Alias[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {AliasChange[]} the changes from the old array to the new array
 * @example
 */
export default function aliasDiff(o: Alias[], n: Alias[], parentID: string): AliasChange[] {
    const { added, updated, removed } = diffArray(
        o,
        n,
        'internalID',
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
