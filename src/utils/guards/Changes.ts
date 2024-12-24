import { Change } from '../diff/Change';
import { StatementChange } from '../diff/statementsDiff';

/**
 * A guard for the StatementChange type.
 *
 * @param {Change} change The change to check.
 * @returns {change is StatementChange} True if the change is a StatementChange.
 * @example
 *   if (isStatementChange(change)) {
 *      // Do something
 *   }
 */
export default function isStatementChange(change: Change): change is StatementChange {
    return change.type === 'statement';
}
