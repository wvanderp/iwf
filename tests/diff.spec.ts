import { describe, it } from 'mocha';
import { expect } from 'chai';
import { aliasDiff, Changes, descriptionDiff, labelDiff } from '../src/diff';
import { Alias, Description, Label } from '../src';

describe('diffs', () => {
    describe('label diff', () => {
        it('should diff labels right', () => {
            const a: Label[] = [
                new Label({language: 'en', value: 'Difference'}),
                new Label({language: 'nl', value: 'Verschil'}),
                new Label({language: 'ko', value: '차이점'})
            ];
            const b: Label[] = [
                new Label({language: 'en', value: 'Change'}),
                new Label({language: 'de', value: 'Unterschied'}),
                new Label({language: 'ko', value: '차이점'})
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

            expect(labelDiff(a, b, 'Q2')).to.deep.equal(changes);
        });
    });

    describe('description diff', () => {
        it('should diff descriptions right', () => {
            const a: Description[] = [
                new Description({language: 'en', value: 'This is a difference'}),
                new Description({language: 'nl', value: 'Dit is een verschil'}),
                new Description({language: 'ko', value: '이것은 차이입니다'})
            ];
            const b: Description[] = [
                new Description({language: 'en', value: 'This is Change'}),
                new Description({language: 'de', value: 'Das ist ein Unterschied'}),
                new Description({language: 'ko', value: '이것은 차이입니다'})
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

    describe('alias diff', () => {
        it('should diff aliases right', () => {
            const a: Alias[] = [
                new Alias({language: 'ko', value: '차이점'}),
                new Alias({language: 'en', value: 'contrast'}),
                new Alias({language: 'en', value: 'diverge'}),
                new Alias({language: 'en', value: 'alteration'}),
                new Alias({language: 'nl', value: 'verschil'})
            ];

            const b: Alias[] = [
                new Alias({language: 'ko', value: '차이점'}),
                new Alias({language: 'en', value: 'divergence'}),
                new Alias({language: 'fr', value: 'diverge'}),
                new Alias({language: 'en', value: 'alteration'}),
                new Alias({language: 'de', value: 'Unterschied'})
            ];

            b[0].internalID = a[0].internalID;
            b[1].internalID = a[1].internalID;
            b[2].internalID = a[2].internalID;
            b[3].internalID = a[3].internalID;

            const changes: Changes[] = [
                {action: 'add', parentID: 'Q2', type: 'alias', new: {language: 'de', value: 'Unterschied'}},
                {action: 'update', parentID: 'Q2', type: 'alias', new: {language: 'en', value: 'divergence'}, old: {language: 'en', value: 'contrast'}},
                {action: 'update', parentID: 'Q2', type: 'alias', new: {language: 'fr', value: 'diverge'}, old: {language: 'en', value: 'diverge'}},
                {action: 'remove', parentID: 'Q2', type: 'alias', old: {language: 'nl', value: 'verschil'}}
            ];

            expect(aliasDiff(a, b, 'Q2')).to.deep.equal(changes);
        });
    });
});
