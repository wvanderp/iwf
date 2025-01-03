import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import Label from '../../Label';
import { QString } from '../../types/strings';
import { Change } from './Change';

export interface LabelChange extends Change {
    type: 'label',
    action: 'add' | 'remove' | 'update';
    parentID: QString | 'unknown';
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * Finds the added, removed, and changed labels between two arrays.
 *
 * @private
 * @param {Label[]} o The old array.
 * @param {Label[]} n The new array.
 * @param {QString | 'unknown'} parentID The ID of the parent of both the old and the new array.
 * @returns {LabelChange[]} The changes from the old array to the new array.
 */
export default function labelDiff(o: Label[], n: Label[], parentID: QString | 'unknown'): LabelChange[] {
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
