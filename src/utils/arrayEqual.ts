/**
 * Does a deep compare of two arrays.
 *
 * Source: https://stackoverflow.com/a/16436975
 *
 * @private
 * @param {Array} a Array a.
 * @param {Array} b Array b.
 * @returns {boolean} If the arrays are equal.
 */
export default function arrayEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (const [index, element] of a.entries()) {
        if (element !== b[index]) return false;
    }
    return true;
}

/**
 * Does a deep compare of two arrays with a function.
 *
 * Based on source: https://stackoverflow.com/a/16436975
 *
 * @private
 * @param {Array} a Array a.
 * @param {Array} b Array b.
 * @param {Function} compareFunction A function that compares two objects in the array.
 * @returns {boolean} If the arrays are equal.
 */
export function arrayEqualWith<T>(
    a: T[] | undefined,
    b: T[] | undefined,
    compareFunction: (aElement: T, bElement: T) => boolean
): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (const [index, element] of a.entries()) {
        if (!compareFunction(element, b[index])) return false;
    }
    return true;
}
