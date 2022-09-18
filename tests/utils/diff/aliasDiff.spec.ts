import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Alias } from '../../../src';
import aliasDiff from '../../../src/utils/diff/aliasDiff';
import { Changes } from '../../../src/utils/diff/Changes';

describe('alias diff', () => {
    it('should diff aliases right', () => {
        const a: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }), // same
            new Alias({ language: 'en', value: 'contrast' }), // update value
            new Alias({ language: 'es', value: 'divergencia' }), // update language
            new Alias({ language: 'nl', value: 'afwijking' }), // same
            // added
        ];

        const b: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }), // same
            new Alias({ language: 'en', value: 'divergence' }), // update value
            new Alias({ language: 'fr', value: 'divergencia' }), // update language
            new Alias({ language: 'nl', value: 'afwijking' }), // same
            new Alias({ language: 'de', value: 'Verschiedenheit' }) // added
        ];

        const changes: Changes[] = [
            {
                action: 'add',
                parentID: 'Q2',
                type: 'alias',
                new: {
                    language: 'fr',
                    value: 'divergencia'
                }
            },
            {
                action: 'add',
                parentID: 'Q2',
                type: 'alias',
                new: {
                    language: 'de',
                    value: 'Verschiedenheit'
                }
            },
            {
                action: 'update',
                parentID: 'Q2',
                type: 'alias',
                old: {
                    language: 'en',
                    value: 'contrast'
                },
                new: {
                    language: 'en',
                    value: 'divergence'
                }
            },
            {
                action: 'remove',
                parentID: 'Q2',
                type: 'alias',
                old: {
                    language: 'es',
                    value: 'divergencia'
                }
            }
        ];

        expect(aliasDiff(a, b, 'Q2')).to.deep.equal(changes);
    });

    it('should not find changes if they are not there', () => {
        const a: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }),
            new Alias({ language: 'en', value: 'contrast' }),
        ];

        const b: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }),
            new Alias({ language: 'en', value: 'contrast' }),
        ];

        expect(aliasDiff(a, b, 'Q2')).to.deep.equal([]);
    });

    it('should not find changes if there are duplicated values', () => {
        const a: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }),
            new Alias({ language: 'en', value: 'contrast' }),
            new Alias({ language: 'en', value: 'contrast' }),
        ];

        const b: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }),
            new Alias({ language: 'en', value: 'contrast' }),
        ];

        expect(aliasDiff(a, b, 'Q2')).to.deep.equal([]);
    });
});
