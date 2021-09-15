import { describe, it } from 'mocha';
import {Statement as WikidataStatement} from '@wmde/wikibase-datamodel-types';
import { expect } from 'chai';
import { Statement, StringSnak, UrlSnak } from '../src';

const statement: WikidataStatement = {
    mainsnak: {
        snaktype: 'value',
        property: 'P1082',
        hash: '48bc53de04c59ccf4c2b2d0eeb98b7df61656405',
        datavalue: {
            value: {
                amount: '+8405837',
                unit: '1'
            },
            type: 'quantity'
        },
        datatype: 'quantity'
    },
    type: 'statement',
    qualifiers: {
        P585: [
            {
                snaktype: 'value',
                property: 'P585',
                hash: '256ed381037eb5c7c11099e099d085bc66779703',
                datavalue: {
                    value: {
                        time: '+2013-01-01T00:00:00Z',
                        timezone: 0,
                        before: 0,
                        after: 0,
                        precision: 9,
                        calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
                    },
                    type: 'time'
                },
                datatype: 'time'
            }
        ],
        P459: [
            {
                snaktype: 'value',
                property: 'P459',
                hash: 'f34609d440cf44ebaa8a3e704c9369413240618c',
                datavalue: {
                    value: {
                        'entity-type': 'item',
                        'numeric-id': 39825,
                        id: 'Q39825'
                    },
                    type: 'wikibase-entityid'
                },
                datatype: 'wikibase-item'
            }
        ]
    },
    'qualifiers-order': [
        'P585',
        'P459'
    ],
    id: 'Q60$d864bf91-491e-73e0-0a25-03eb16bee95a',
    rank: 'normal',
    references: [
        {
            hash: 'fa278ebfc458360e5aed63d5058cca83c46134f1',
            snaks: {
                P143: [
                    {
                        snaktype: 'value',
                        property: 'P143',
                        hash: 'e4f6d9441d0600513c4533c672b5ab472dc73694',
                        datavalue: {
                            value: {
                                'entity-type': 'item',
                                'numeric-id': 328,
                                id: 'Q328'
                            },
                            type: 'wikibase-entityid'
                        },
                        datatype: 'wikibase-item'
                    }
                ]
            },
            'snaks-order': [
                'P143'
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

    describe('fromSnak', () => {
        const snak = UrlSnak.fromURL('P856', 'http://localhost');
        const newStatement = Statement.fromSnak(snak);

        expect(newStatement.mainsnak.toJSON()).to.deep.equal(snak.toJSON());
    });

    describe('equals', () => {
        it('should equal if ony the qualifiersOrders only filled and equal', () => {
            const a = Statement.fromSnak(UrlSnak.fromURL('P856', 'http://localhost'));
            const b = Statement.fromSnak(UrlSnak.fromURL('P856', 'http://localhost'));

            a.qualifiers = [StringSnak.fromString('P1545', '1')];
            b.qualifiers = [StringSnak.fromString('P1545', '1')];

            a.qualifiersOrder = ['P1545'];
            b.qualifiersOrder = ['P1545'];

            expect(a.equals(b)).to.be.true;
        });

        it('should equal if ony the qualifiersOrders only filled and equal', () => {
            const a = new Statement(statement);
            const b = new Statement(statement);

            expect(a.equals(b)).to.be.true;
        });

        it('should not equal if the id is changed', () => {
            const a = new Statement(statement);
            const b = new Statement(statement);

            b.id = '1';

            expect(a.equals(b)).to.be.false;
        });

        it('should not equal if the rank is changed', () => {
            const a = new Statement(statement);
            const b = new Statement(statement);

            b.rank = 'deprecated';

            expect(a.equals(b)).to.be.false;
        });

        it('should not equal if the qualifiersOrder is changed', () => {
            const a = new Statement(JSON.parse(JSON.stringify(statement)));
            const b = new Statement(JSON.parse(JSON.stringify(statement)));

            b.qualifiersOrder.pop();

            expect(a.equals(b)).to.be.false;
        });

        it('should not equal if the mainsnak is changed', () => {
            const a = new Statement(statement);
            const b = new Statement(statement);

            b.mainsnak = UrlSnak.fromURL('P856', 'http://localhost');

            expect(a.equals(b)).to.be.false;
        });

        it('should not equal if the references is changed', () => {
            const a = new Statement(statement);
            const b = new Statement(statement);

            b.references.pop();

            expect(a.equals(b)).to.be.false;
        });

        it('should not equal if the qualifiers is changed', () => {
            const a = new Statement(statement);
            const b = new Statement(statement);

            b.qualifiers.pop();

            expect(a.equals(b)).to.be.false;
        });
    });
});
