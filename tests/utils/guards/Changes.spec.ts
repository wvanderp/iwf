import { isStatementChange } from '../../../src/index';
import { StatementChange } from '../../../src/utils/diff/statementsDiff';
import { LabelChange } from '../../../src/utils/diff/labelDiff';

const statementChange: StatementChange = {
    type: 'statement',
    action: 'add',
    parentID: 'unknown',
    old: undefined,
    new: undefined
};

const labelChange: LabelChange = {
    type: 'label',
    action: 'remove',
    parentID: 'Q1',
    old: undefined,
    new: undefined,
};

describe('isStatementChange', () => {
    it('should return true for a StatementChange', () => {
        expect(isStatementChange(statementChange)).toBe(true);
        expect(isStatementChange(labelChange)).toBe(false);
    });
});
