import { describe, it } from 'mocha';
import {Statement as wikidataStatement} from '@wmde/wikibase-datamodel-types';
import { expect } from 'chai';
import { Statement } from '../src';

const statement: wikidataStatement = {
    mainsnak: {
        snaktype: 'value',
        property: 'P610',
        datavalue: {
            value: {
                'entity-type': 'item',
                'numeric-id': 19259618,
                id: 'Q19259618'
            },
            type: 'wikibase-entityid'
        },
        datatype: 'wikibase-item'
    },
    type: 'statement',
    id: 'Q64$fe5767c9-4d4b-2d3a-2a13-9a3072793753',
    rank: 'normal',
    references: [
        {
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
        }
    ]
};

describe('Statement', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const statementObject = new Statement(statement);

            expect(statementObject.toJSON()).to.deep.equal(statement);
        });
    });
});
