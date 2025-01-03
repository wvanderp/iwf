import {
    EString, LString, PString, QString,
    SenseString
} from '../../types/strings';

const QStringRegex = /Q\d+$/m;

/**
 * Tests if a string is a QString.
 * Can also be used as a type guard.
 *
 * @param {string} string_ The string to test.
 * @returns {string_ is QString} True if the string is a QString.
 * @example
 *    const id = 'Q123';
 *    if (!isQString(id)) {
 *        throw new Error('Not a QString');
 *    }
 *    WikibaseItemSnak.fromID('P42', id);
 */
export function isQString(string_: string): string_ is QString {
    return QStringRegex.test(string_);
}

const PStringRegex = /P\d+$/m;

/**
 * Tests if a string is a PString.
 * Can also be used as a type guard.
 *
 * @param {string} string_ The string to test.
 * @returns {string_ is PString} True if the string is a PString.
 * @example
 *    const property = 'P123';
 *    if (!isPString(property)) {
 *        throw new Error('Not a PString');
 *    }
 *    WikibaseItemSnak.fromID(property, 'Q123');
 */
export function isPString(string_: string): string_ is PString {
    return PStringRegex.test(string_);
}

const LStringRegex = /L\d+$/m;

/**
 * Tests if a string is a LString.
 * Can also be used as a type guard.
 *
 * @param {string} string_ The string to test.
 * @returns {string_ is LString} True if the string is a LString.
 * @example
 *    const property = 'L123';
 *    if (!isLString(property)) {
 *        throw new Error('Not a LString');
 *    }
 *    WikibaseLexemeSnak.fromID(property);
 */
export function isLString(string_: string): string_ is LString {
    return LStringRegex.test(string_);
}

const EStringRegex = /E\d+$/m;

/**
 * Tests if a string is an EString.
 * Can also be used as a type guard.
 *
 * @param {string} string_ The string to test.
 * @returns {string_ is EString} True if the string is an EString.
 * @example
 *    const property = 'E123';
 *    if (!isEString(property)) {
 *        throw new Error('Not an EString');
 *    }
 *    EntitySchemaSnak.fromID('P698', property);
 */
export function isEString(string_: string): string_ is EString {
    return EStringRegex.test(string_);
}

const SenseStringRegex = /L\d+-S\d+$/m;

/**
 * Tests if a string is a SenseString.
 * Can also be used as a type guard.
 *
 * @param {string} string_ The string to test.
 * @returns {string_ is SenseString} True if the string is a SenseString.
 * @example
 *    const property = 'L123-S4';
 *    if (!isSenseString(property)) {
 *        throw new Error('Not a SenseString');
 *    }
 *    WikibaseSenseSnak.fromID(property);
 */
export function isSenseString(string_: string): string_ is SenseString {
    return SenseStringRegex.test(string_);
}
