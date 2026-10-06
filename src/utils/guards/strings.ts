import {
    EString, FormString, LString, PString, QString,
    SenseString
} from '../../types/strings';

const QStringRegex = /^Q\d+$/;

/**
 * Tests if a string is a QString.
 * Can also be used as a type guard.
 *
 * @param string_ The string to test.
 * @returns True if the string is a QString.
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

const PStringRegex = /^P\d+$/;

/**
 * Tests if a string is a PString.
 * Can also be used as a type guard.
 *
 * @param string_ The string to test.
 * @returns True if the string is a PString.
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

const LStringRegex = /^L\d+$/;

/**
 * Tests if a string is a LString.
 * Can also be used as a type guard.
 *
 * @param string_ The string to test.
 * @returns True if the string is a LString.
 * @example
 *    const property = 'L123';
 *    if (!isLString(property)) {
 *        throw new Error('Not a LString');
 *    }
 *    WikibaseLexemeSnak.fromData('P6553', property);
 */
export function isLString(string_: string): string_ is LString {
    return LStringRegex.test(string_);
}

const EStringRegex = /^E\d+$/;

/**
 * Tests if a string is an EString.
 * Can also be used as a type guard.
 *
 * @param string_ The string to test.
 * @returns True if the string is an EString.
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

const SenseStringRegex = /^L\d+-S\d+$/;

/**
 * Tests if a string is a SenseString.
 * Can also be used as a type guard.
 *
 * @param string_ The string to test.
 * @returns True if the string is a SenseString.
 * @example
 *    const property = 'L123-S4';
 *    if (!isSenseString(property)) {
 *        throw new Error('Not a SenseString');
 *    }
 *    WikibaseSenseSnak.fromData('P5972', property);
 */
export function isSenseString(string_: string): string_ is SenseString {
    return SenseStringRegex.test(string_);
}

const FormStringRegex = /^L\d+-F\d+$/;

/**
 * Tests if a string is a FormString.
 * Can also be used as a type guard.
 *
 * @param string_ The string to test.
 * @returns True if the string is a FormString.
 * @example
 *    const id = 'L123-F4';
 *    if (!isFormString(id)) {
 *        throw new Error('Not a FormString');
 *    }
 *    WikibaseFormSnak.fromData('P5830', id);
 */
export function isFormString(string_: string): string_ is FormString {
    return FormStringRegex.test(string_);
}
