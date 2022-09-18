import { expect } from 'chai';
import { describe, it } from 'mocha';
import WikibaseItemSnak from '../../../src/snaks/WikibaseItemSnak';
import Statement from '../../../src/Statement';
import statementDiff from '../../../src/utils/diff/statementsDiff';

describe('statement diff', () => {
    it('should diff statements right', () => {
        const a = [
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q3')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P3', 'Q3'))

        ];

        const b = [
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q4')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P4', 'Q3'))
        ];

        expect(statementDiff(a, b, 'Q15')).to.deep.equal([{
            action: 'add',
            parentID: 'Q15',
            type: 'statement',
            new: {
                mainsnak: {
                    snaktype: 'value', property: 'P2', datavalue: { value: { 'entity-type': 'item', 'numeric-id': 4, id: 'Q4' }, type: 'wikibase-entityid' }, datatype: 'wikibase-item'
                },
                type: 'statement',
                rank: 'normal'
            }
        }, {
            action: 'add',
            parentID: 'Q15',
            type: 'statement',
            new: {
                mainsnak: {
                    snaktype: 'value', property: 'P4', datavalue: { value: { 'entity-type': 'item', 'numeric-id': 3, id: 'Q3' }, type: 'wikibase-entityid' }, datatype: 'wikibase-item'
                },
                type: 'statement',
                rank: 'normal'
            }
        }, {
            action: 'remove',
            parentID: 'Q15',
            type: 'statement',
            old: {
                mainsnak: {
                    snaktype: 'value', property: 'P2', datavalue: { value: { 'entity-type': 'item', 'numeric-id': 3, id: 'Q3' }, type: 'wikibase-entityid' }, datatype: 'wikibase-item'
                },
                type: 'statement',
                rank: 'normal'
            }
        }, {
            action: 'remove',
            parentID: 'Q15',
            type: 'statement',
            old: {
                mainsnak: {
                    snaktype: 'value', property: 'P3', datavalue: { value: { 'entity-type': 'item', 'numeric-id': 3, id: 'Q3' }, type: 'wikibase-entityid' }, datatype: 'wikibase-item'
                },
                type: 'statement',
                rank: 'normal'
            }
        }]);
    });
    it('should find diffs when there aren\'t any', () => {
        const a = [
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2'))
        ];

        const b = [
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2'))
        ];

        expect(statementDiff(a, b, 'Q2')).to.deep.equal([]);
    });
});
