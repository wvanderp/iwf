import { describe, it } from 'mocha';
import { expect } from 'chai';

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
    expect(isStatementChange(statementChange)).to.be.true;
    expect(isStatementChange(labelChange)).to.be.false;
});
