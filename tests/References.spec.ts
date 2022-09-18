import { describe, it } from 'mocha';
import { Reference as wikidataReference } from '@wmde/wikibase-datamodel-types';
import { expect } from 'chai';
import { Reference } from '../src';
import snakGenerator from '../src/utils/snakGenerator';

const reference: wikidataReference = {
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
            const reference_ = new Reference(reference);

            expect(reference_.internalID).to.equal('09053488de167eab55fa60977cf8c0be7653ef0c6dc29fc75413f149db15a808');
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const referenceObject = new Reference(reference);

            expect(referenceObject.toJSON()).to.deep.equal(reference);
        });
    });

    describe('fromSnaks', () => {
        it('should create a reference from snaks', () => {
            const snaks = Object.values(reference.snaks).flat().map(((snak) => snakGenerator(snak)));

            const newReference = Reference.fromSnaks(snaks);
            newReference.hash = reference.hash;
            newReference.snaksOrder = reference['snaks-order'];

            expect(newReference.toJSON()).to.deep.equal(reference);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const referenceObject = new Reference(reference);
            const referenceObject2 = new Reference(reference);

            expect(referenceObject.equals(referenceObject2)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const referenceObject = new Reference(reference);
            const referenceObject2 = new Reference(reference);

            referenceObject2.hash = 'some hash';

            expect(referenceObject.equals(referenceObject2)).to.be.false;
        });
    });
});
