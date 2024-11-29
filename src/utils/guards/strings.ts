import {
    EString, LString, PString, QString,
    SenseString
} from '../../types/strings';

const QStringRegex = /Q\d+$/m;

/**
 * Test if a string is a QString
 * Can also be used a type guard
 *
 * @param {string} string_ The string to test
 * @returns {boolean} true if the string is a QString
 * @example
 *    const id = 'Q123';
 *    if(!isQString(id)) {
 *        throw new Error('not a QString');
 *    }
 *    WikibaseItemSnak.fromID('P42', id);
 */
export function isQString(string_: string): string_ is QString {
    return QStringRegex.test(string_);
}

const PStringRegex = /P\d+$/m;

/**
 * Test if a string is a PString
 * Can also be used a type guard
 *
 * @param {string} string_ The string to test
 * @returns {boolean} true if the string is a PString
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

const LStringRegex = /L\d+$/m;

/**
 * Test if a string is a LString
 * Can also be used a type guard
 *
 * @param {string} string_ The string to test
 * @returns {boolean} true if the string is a LString
 * @example
 *    const property = 'L123';
 *    if(!isLString(property)) {
 *        throw new Error('not a LString');
 *    }
 *    WikibaseLexemeSnak.fromID(property);
 */
export function isLString(string_: string): string_ is LString {
    return LStringRegex.test(string_);
}

const EStringRegex = /E\d+$/m;

/**
 * Test if a string is a EString
 * Can also be used a type guard
 *
 * @param {string} string_ The string to test
 * @returns {boolean} true if the string is a EString
 * @example
 *    const property = 'E123';
 *    if(!isEString(property)) {
 *        throw new Error('not a EString');
 *    }
 *    EntitySchemaSnak.fromID('P698', property);
 */
export function isEString(string_: string): string_ is EString {
    return EStringRegex.test(string_);
}

const SenseStringRegex = /L\d+-S\d+$/m;

/**
 * Test if a string is a SenseString
 * Can also be used a type guard
 *
 * @param {string} string_ The string to test
 * @returns {boolean} true if the string is a SenseString
 * @example
 *    const property = 'L123-S4';
 *    if(!isSenseString(property)) {
 *        throw new Error('not a SenseString');
 *    }
 *    WikibaseSenseSnak.fromID(property);
 */
export function isSenseString(string_: string): string_ is SenseString {
    return SenseStringRegex.test(string_);
}
