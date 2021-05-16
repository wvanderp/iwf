"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayEqualWith = void 0;
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
function arrayEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (const [index, element] of a.entries()) {
        if (element !== b[index])
            return false;
    }
    return true;
}
exports.default = arrayEqual;
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
function arrayEqualWith(a, b, compareFunction) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (const [index, element] of a.entries()) {
        if (!compareFunction(element, b[index]))
            return false;
    }
    return true;
}
exports.arrayEqualWith = arrayEqualWith;
//# sourceMappingURL=arrayEqual.js.map