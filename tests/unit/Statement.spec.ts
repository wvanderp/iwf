import { Statement as WikidataStatement } from '@wmde/wikibase-datamodel-types';
import {
    Statement, StringSnak, URLSnak, WikibaseItemSnak
} from '../../src';

const statementJson: WikidataStatement = {
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
    describe('getInternalId', () => {
        it('should return the internal id', () => {
            const statement = new Statement(statementJson);
            expect(statement.internalID).toEqual('f5472c835614d225989b789e923d52a07d7d1892625ba6ad7de5e6b6f5ad182e');
        });

        it('should not change when the statement changes', () => {
            const statement = new Statement(statementJson);
            const internalId = statement.internalID;
            statement.mainsnak = StringSnak.fromString('P1', 'foo');
            expect(statement.internalID).toEqual(internalId);
        });
    });

    describe('getProperty', () => {
        it('should return the property', () => {
            const statement = new Statement(statementJson);
            expect(statement.property).toEqual('P1082');
        });

        it('should change when the snak changes', () => {
            const statement = new Statement(statementJson);
            // eslint-disable-next-line prefer-destructuring
            const property = statement.property;
            statement.mainsnak = StringSnak.fromString('P1', 'foo');
            expect(statement.property).not.toEqual(property);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const statementObject = new Statement(statementJson);

            expect(statementObject.toJSON()).toStrictEqual(statementJson);
        });
    });

    describe('fromSnak', () => {
        it('should create a statement from a snak', () => {
            const snak = URLSnak.fromURL('P856', 'http://localhost');
            const newStatement = Statement.fromSnak(snak);

            expect(newStatement.mainsnak.toJSON()).toStrictEqual(snak.toJSON());
        });
    });

    describe('equals', () => {
        it('should equal if only the qualifiersOrders only filled and equal', () => {
            const a = Statement.fromSnak(URLSnak.fromURL('P856', 'http://localhost'));
            const b = Statement.fromSnak(URLSnak.fromURL('P856', 'http://localhost'));

            a.qualifiers = [StringSnak.fromString('P1545', '1')];
            b.qualifiers = [StringSnak.fromString('P1545', '1')];

            a.qualifiersOrder = ['P1545'];
            b.qualifiersOrder = ['P1545'];

            expect(a.equals(b)).toBe(true);
        });

        it('should equal a full test', () => {
            const a = new Statement(statementJson);
            const b = new Statement(statementJson);

            expect(a.equals(b)).toBe(true);
        });

        it('should not equal if the id is changed', () => {
            const a = new Statement(statementJson);
            const b = new Statement(statementJson);

            b.id = '1';

            expect(a.equals(b)).toBe(false);
        });

        it('should not equal if the rank is changed', () => {
            const a = new Statement(statementJson);
            const b = new Statement(statementJson);

            b.rank = 'deprecated';

            expect(a.equals(b)).toBe(false);
        });

        it('should not equal if the qualifiersOrder is changed', () => {
            const a = new Statement(structuredClone(statementJson));
            const b = new Statement(structuredClone(statementJson));

            b.qualifiersOrder.pop();

            expect(a.equals(b)).toBe(false);
        });

        it('should not equal if the mainsnak is changed', () => {
            const a = new Statement(statementJson);
            const b = new Statement(statementJson);

            b.mainsnak = URLSnak.fromURL('P856', 'http://localhost');

            expect(a.equals(b)).toBe(false);
        });

        it('should not equal if the references is changed', () => {
            const a = new Statement(statementJson);
            const b = new Statement(statementJson);

            b.references.pop();

            expect(a.equals(b)).toBe(false);
        });

        it('should not equal if the qualifiers is changed', () => {
            const a = new Statement(statementJson);
            const b = new Statement(statementJson);

            b.qualifiers.pop();

            expect(a.equals(b)).toBe(false);
        });

        it('should not equal if it is not equal', () => {
            const a = Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q2'));
            const b = Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2'));

            expect(a.equals(b)).toBe(false);
        });
    });
});
