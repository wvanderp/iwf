import { describe, it } from 'mocha';
import {Reference as wikidataReference} from '@wmde/wikibase-datamodel-types';
import { expect } from 'chai';
import Reference from '../src/Reference';

const reference : wikidataReference = {
    hash: 'e43b1cc9b71d1713d4d6cb76e2abd0b5c36c2a27',
    snaks: {
        P854: [
            {
                snaktype: 'value',
                property: 'P854',
                datavalue: {
                    value: 'http://www.tagesspiegel.de/berlin/teufelsberg-oder-arkenberge-zum-wettstreit-um-den-hoechsten-gipfel-berlins/11413932.html',
                    type: 'string'
                },
                datatype: 'url'
            }
        ],
        P1476: [
            {
                snaktype: 'value',
                property: 'P1476',
                datavalue: {
                    value: {
                        text: 'Zum Wettstreit um den h\u00F6chsten Gipfel Berlins',
                        language: 'de'
                    },
                    type: 'monolingualtext'
                },
                datatype: 'monolingualtext'
            }
        ]
    },
    'snaks-order': [
        'P854',
        'P1476'
    ]
};

describe('Reference', () => {
    it('should Ingest normal Reference object', () => {
        // eslint-disable-next-line no-new
        new Reference(reference);
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const referenceObject = new Reference(reference);

            expect(referenceObject.toJSON()).to.deep.equal(reference);
        });
    });
});
