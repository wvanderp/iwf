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
export default function arrayEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean;
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
export declare function arrayEqualWith<T>(a: T[] | undefined, b: T[] | undefined, compareFunction: (aElement: T, bElement: T) => boolean): boolean;
//# sourceMappingURL=arrayEqual.d.ts.map