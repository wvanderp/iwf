/* eslint-disable no-continue */
import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import diffArray from 'diff-arrays-of-objects';

import Alias from './Alias';
import Description from './Description';
import Label from './Label';

interface Change {
    type: string;
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: unknown;
    new?: unknown;
}

interface LabelChange extends Change {
    type: 'label',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

interface DescriptionChange extends Change {
    type: 'description',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

interface AliasChange extends Change {
    type: 'alias',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * finds the added, removed, and changed Labels between two Arrays
 *
 * @param {Label[]} o the old array
 * @param {Label[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {LabelChange[]} the changes from the old array to the new array
 */
export function labelDiff(o: Label[], n: Label[], parentID: string): LabelChange[] {
    const changes: LabelChange[] = [];
    for (const label of o) {
        const counterLabel = n.find((l) => l.language === label.language);

        if (counterLabel === undefined) {
            changes.push({
                type: 'label',
                action: 'remove',
                parentID,
                old: label.toJSON()
            });
        }

        if (counterLabel !== undefined && label.value !== counterLabel.value) {
            changes.push({
                type: 'label',
                action: 'update',
                parentID,
                old: label.toJSON(),
                new: counterLabel.toJSON()
            });
        }
    }

    for (const label of n) {
        const counterLabel = o.find((l) => l.language === label.language);

        if (counterLabel === undefined) {
            changes.push({
                type: 'label',
                action: 'add',
                parentID,
                new: label.toJSON()
            });
        }
    }

    return changes;
}

/**
 * finds the added, removed, and changed descriptions between two Arrays
 *
 * @param {Description[]} o the old array
 * @param {Description[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {DescriptionChange[]} the changes from the old array to the new array
 */
export function descriptionDiff(o: Description[], n: Description[], parentID: string): DescriptionChange[] {
    const changes: DescriptionChange[] = [];
    for (const description of o) {
        const counterDescription = n.find((l) => l.language === description.language);

        if (counterDescription === undefined) {
            changes.push({
                type: 'description',
                action: 'remove',
                parentID,
                old: description.toJSON()
            });
        }

        if (counterDescription !== undefined && description.value !== counterDescription.value) {
            changes.push({
                type: 'description',
                action: 'update',
                parentID,
                old: description.toJSON(),
                new: counterDescription.toJSON()
            });
        }
    }

    for (const description of n) {
        const counterDescription = o.find((l) => l.language === description.language);

        if (counterDescription === undefined) {
            changes.push({
                type: 'description',
                action: 'add',
                parentID,
                new: description.toJSON()
            });
        }
    }

    return changes;
}

/**
 * finds the added, removed, and changed aliases between two Arrays
 *
 * @param {Alias[]} o the old array
 * @param {Alias[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {AliasChange[]} the changes from the old array to the new array
 */
export function aliasDiff(o: Alias[], n: Alias[], parentID: string): AliasChange[] {
    const {added, updated, removed} = diffArray(
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

export type Changes = LabelChange | DescriptionChange | AliasChange;
