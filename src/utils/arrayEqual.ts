/**
 * Does a deep compare of two arrays
 *
 * source: https://stackoverflow.com/a/16436975
 *
 * @private
 * @param {Array} a array a
 * @param {Array} b array b
 * @returns {boolean} if the arrays are equal
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
 * Does a deep compare of two arrays with a function
 *
 * based on source: https://stackoverflow.com/a/16436975
 *
 * @private
 * @param {Array} a array a
 * @param {Array} b array b
 * @param {Function} compareFunction a function tat compares to objects in the array
 * @returns {boolean} if the arrays are equal
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
