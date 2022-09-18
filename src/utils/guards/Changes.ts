import { Change } from '../diff/Change';
import { StatementChange } from '../diff/statementsDiff';

/**
 * a guard for the StatementChange type
 *
 * @param {Change} change the change to check
 * @returns {change is StatementChange} true if the change is a StatementChange
 * @example
 *   if (isStatementChange(change)) {
 *      // do something
 *   }
 */
export default function isStatementChange(change: Change): change is StatementChange {
    return change.type === 'statement';
}
