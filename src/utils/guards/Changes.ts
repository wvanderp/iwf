import { Change } from '../diff/Change';
import { StatementChange } from '../diff/statementsDiff';

/**
 * A guard for the StatementChange type.
 *
 * @param change The change to check.
 * @returns True if the change is a StatementChange.
 * @example
 *   if (isStatementChange(change)) {
 *      // Do something
 *   }
 */
export default function isStatementChange(change: Change): change is StatementChange {
    return change.type === 'statement';
}
