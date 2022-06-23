import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Alias } from '../../../src';
import aliasDiff from '../../../src/utils/diff/aliasDiff';
import { Changes } from '../../../src/utils/diff/Changes';

describe('alias diff', () => {
    it('should diff aliases right', () => {
        const a: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }),
            new Alias({ language: 'en', value: 'contrast' }),
            new Alias({ language: 'en', value: 'diverge' }),
            new Alias({ language: 'en', value: 'alteration' }),
            new Alias({ language: 'nl', value: 'verschil' })
        ];

        const b: Alias[] = [
            new Alias({ language: 'ko', value: '차이점' }),
            new Alias({ language: 'en', value: 'divergence' }),
            new Alias({ language: 'fr', value: 'diverge' }),
            new Alias({ language: 'en', value: 'alteration' }),
            new Alias({ language: 'de', value: 'Unterschied' })
        ];

        b[0].internalID = a[0].internalID;
        b[1].internalID = a[1].internalID;
        b[2].internalID = a[2].internalID;
        b[3].internalID = a[3].internalID;

        const changes: Changes[] = [
            {
                action: 'add', parentID: 'Q2', type: 'alias', new: { language: 'de', value: 'Unterschied' }
            },
            {
                action: 'update', parentID: 'Q2', type: 'alias', new: { language: 'en', value: 'divergence' }, old: { language: 'en', value: 'contrast' }
            },
            {
                action: 'update', parentID: 'Q2', type: 'alias', new: { language: 'fr', value: 'diverge' }, old: { language: 'en', value: 'diverge' }
            },
            {
                action: 'remove', parentID: 'Q2', type: 'alias', old: { language: 'nl', value: 'verschil' }
            }
        ];

        expect(aliasDiff(a, b, 'Q2')).to.deep.equal(changes);
    });
});
