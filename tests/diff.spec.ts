import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Changes, labelDiff } from '../src/diff';
import { Label } from '../src';

describe('diffs', () => {
    describe('label diff', () => {
        it('should diff right', () => {
            const a: Label[] = [
                new Label({language: 'en', value: 'Difference'}),
                new Label({language: 'nl', value: 'Verschil'})
            ];
            const b: Label[] = [
                new Label({language: 'en', value: 'Change'}),
                new Label({language: 'de', value: 'Unterschied'})
            ];

            const changes: Changes[] = [
                {
                    action: 'update',
                    new: {
                        language: 'en',
                        value: 'Change'
                    },
                    orig: {
                        language: 'en',
                        value: 'Difference'
                    },
                    parentID: 'Q2',
                    type: 'label'
                },
                {
                    action: 'remove',
                    orig: {
                        language: 'nl',
                        value: 'Verschil'
                    },
                    parentID: 'Q2',
                    type: 'label'
                },
                {
                    action: 'add',
                    new: {
                        language: 'de',
                        value: 'Unterschied'
                    },
                    parentID: 'Q2',
                    type: 'label'
                }
            ];

            expect(labelDiff(a, b, 'Q2')).to.deep.equal(changes);
        });
    });
});
