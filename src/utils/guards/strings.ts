import { PString, QString } from '../../types/strings';

const QstringRegex = /Q\d+$/m;
const PStringRegex = /P\d+$/m;

/**
 * test if a string is a QString
 * can also be used a type guard
 *
 * @param {string} string_ the string to test
 * @returns {boolean} true if the string is a QString
 * @example
 *    const id = 'Q123';
 *    if(!isQString(id)) {
 *        throw new Error('not a QString');
 *    }
 *    WikibaseItemSnak.fromID('P42', id);
 */
export function isQString(string_: string): string_ is QString {
    return QstringRegex.test(string_);
}

/**
 * test if a string is a PString
 * can also be used a type guard
 *
 * @param {string} string_ the string to test
 * @returns {boolean} true if the string is a Qstring
 * @example
 *    const property = 'Q123';
 *    if(!isPString(property)) {
 *        throw new Error('not a PString');
 *    }
 *    WikibaseItemSnak.fromID(property, 'Q123');
 */
export function isPString(string_: string): string_ is PString {
    return PStringRegex.test(string_);
}
