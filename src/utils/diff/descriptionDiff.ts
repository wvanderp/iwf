import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import { Description } from '../..';
import { Change } from './Change';

export interface DescriptionChange extends Change {
    type: 'description',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * finds the added, removed, and changed descriptions between two Arrays
 *
 * @param {Description[]} o the old array
 * @param {Description[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {DescriptionChange[]} the changes from the old array to the new array
 */
export default function descriptionDiff(o: Description[], n: Description[], parentID: string): DescriptionChange[] {
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
