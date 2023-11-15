import { Reference as wikidataReference } from '@wmde/wikibase-datamodel-types';
import { Reference } from '../src';
import snakGenerator from '../src/utils/snakGenerator';
import URLSnak from '../src/snaks/URLSnak';

const referenceJson: wikidataReference = {
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
            },
            {
                snaktype: 'value',
                property: 'P854',
                datavalue: {
                    value: 'https://www.tagesspiegel.de/',
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
    describe('internalID', () => {
        it('should be the hash of the json', () => {
            const reference = new Reference(referenceJson);
            expect(reference.internalID).toEqual('09053488de167eab55fa60977cf8c0be7653ef0c6dc29fc75413f149db15a808');
        });

        it('should not change when the reference changes', () => {
            const reference = new Reference(referenceJson);
            const id = reference.internalID;
            reference.snaks.push(URLSnak.fromURL('P854', 'https://www.tagesspiegel.de/'));
            expect(reference.internalID).toEqual(id);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const reference = new Reference(referenceJson);

            expect(reference.toJSON()).toStrictEqual(referenceJson);
        });
    });

    describe('fromSnaks', () => {
        it('should create a reference from snaks', () => {
            const snaks = Object.values(referenceJson.snaks).flat().map(((snak) => snakGenerator(snak)));

            const reference = Reference.fromSnaks(snaks);
            reference.hash = referenceJson.hash;
            reference.snaksOrder = referenceJson['snaks-order'];

            expect(reference.toJSON()).toStrictEqual(referenceJson);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const reference = new Reference(referenceJson);
            const reference2 = new Reference(referenceJson);

            expect(reference.equals(reference2)).toBe(true);
        });

        it('should be false if the items are NOT equal', () => {
            const reference = new Reference(referenceJson);
            const reference2 = new Reference(referenceJson);

            reference2.hash = 'some hash';

            expect(reference.equals(reference2)).toBe(false);
        });
    });
});
