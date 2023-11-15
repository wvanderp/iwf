import { Label } from '../../../src';
import { Changes } from '../../../src/utils/diff/Changes';
import labelDiff from '../../../src/utils/diff/labelDiff';

describe('label diff', () => {
    it('should diff labels right', () => {
        const a: Label[] = [
            new Label({ language: 'en', value: 'Difference' }),
            new Label({ language: 'nl', value: 'Verschil' }),
            new Label({ language: 'ko', value: '차이점' })
        ];
        const b: Label[] = [
            new Label({ language: 'en', value: 'Change' }),
            new Label({ language: 'de', value: 'Unterschied' }),
            new Label({ language: 'ko', value: '차이점' })
        ];

        const changes: Changes[] = [
            {
                action: 'update',
                new: {
                    language: 'en',
                    value: 'Change'
                },

                old: {
                    language: 'en',
                    value: 'Difference'
                },
                parentID: 'Q2',
                type: 'label'
            },
            {
                action: 'remove',
                old: {
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

        expect(labelDiff(a, b, 'Q2')).toStrictEqual(changes);
    });

    it('should not find diffs when there aren\'t any', () => {
        const a: Label[] = [
            new Label({ language: 'en', value: 'Difference' }),
            new Label({ language: 'nl', value: 'Verschil' }),
            new Label({ language: 'ko', value: '차이점' })
        ];
        const b: Label[] = [
            new Label({ language: 'en', value: 'Difference' }),
            new Label({ language: 'nl', value: 'Verschil' }),
            new Label({ language: 'ko', value: '차이점' })
        ];

        expect(labelDiff(a, b, 'Q2')).toStrictEqual([]);
    });

    it('should find diffs when the new array is empty', () => {
        const a: Label[] = [
            new Label({ language: 'en', value: 'Difference' }),
            new Label({ language: 'nl', value: 'Verschil' }),
            new Label({ language: 'ko', value: '차이점' })
        ];

        const b: Label[] = [];

        const changes: Changes[] = [
            {
                action: 'remove',
                old: {
                    language: 'en',
                    value: 'Difference'
                },
                parentID: 'Q2',
                type: 'label'
            },
            {
                action: 'remove',
                old: {
                    language: 'nl',
                    value: 'Verschil'
                },
                parentID: 'Q2',
                type: 'label'
            },
            {
                action: 'remove',
                old: {
                    language: 'ko',
                    value: '차이점'
                },
                parentID: 'Q2',
                type: 'label'
            }
        ];

        expect(labelDiff(a, b, 'Q2')).toStrictEqual(changes);
    });
});
