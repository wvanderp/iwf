import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Description } from '../../../src';
import { Changes } from '../../../src/utils/diff/Changes';
import descriptionDiff from '../../../src/utils/diff/descriptionDiff';

describe('description diff', () => {
    it('should diff descriptions right', () => {
        const a: Description[] = [
            new Description({ language: 'en', value: 'This is a difference' }),
            new Description({ language: 'nl', value: 'Dit is een verschil' }),
            new Description({ language: 'ko', value: '이것은 차이입니다' })
        ];
        const b: Description[] = [
            new Description({ language: 'en', value: 'This is Change' }),
            new Description({ language: 'de', value: 'Das ist ein Unterschied' }),
            new Description({ language: 'ko', value: '이것은 차이입니다' })
        ];

        const changes: Changes[] = [
            {
                action: 'update',
                new: {
                    language: 'en',
                    value: 'This is Change'
                },
                old: {
                    language: 'en',
                    value: 'This is a difference'
                },
                parentID: 'Q2',
                type: 'description'
            },
            {
                action: 'remove',
                old: {
                    language: 'nl',
                    value: 'Dit is een verschil'
                },
                parentID: 'Q2',
                type: 'description'
            },
            {
                action: 'add',
                new: {
                    language: 'de',
                    value: 'Das ist ein Unterschied'
                },
                parentID: 'Q2',
                type: 'description'
            }
        ];

        expect(descriptionDiff(a, b, 'Q2')).to.deep.equal(changes);
    });
});
