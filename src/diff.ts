/* eslint-disable no-continue */
import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import Label from './Label';

interface Change {
    type: string;
    action: 'add' | 'remove' | 'update';
    parentID: string;
    orig?: unknown;
    new?: unknown;
}

interface LabelChange extends Change {
    type: 'label',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    orig?: LabelAndDescription;
    new?: LabelAndDescription;
}

/**
 * @param {Label[]} o the old array
 * @param {Label[]} n the new array
 * @param parentID
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
                orig: label.toJSON()
            });
        }

        if (counterLabel !== undefined && label.value !== counterLabel.value) {
            changes.push({
                type: 'label',
                action: 'update',
                parentID,
                orig: label.toJSON(),
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

export type Changes = LabelChange
