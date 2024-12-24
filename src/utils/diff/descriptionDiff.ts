import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import Description from '../../Description';
import { QString } from '../../types/strings';
import { Change } from './Change';

export interface DescriptionChange extends Change {
    type: 'description',
    action: 'add' | 'remove' | 'update';
    parentID: QString | 'unknown';
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * Finds the added, removed, and changed descriptions between two arrays.
 *
 * @private
 * @param {Description[]} o The old array.
 * @param {Description[]} n The new array.
 * @param {QString | 'unknown'} parentID The ID of the parent of both the old and the new array.
 * @returns {DescriptionChange[]} The changes from the old array to the new array.
 */
export default function descriptionDiff(o: Description[], n: Description[], parentID: QString | 'unknown'): DescriptionChange[] {
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
