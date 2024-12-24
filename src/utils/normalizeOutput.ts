/* eslint-disable no-param-reassign */
// @ts-nocheck

/**
 * This function removes keys which are undefined.
 * Although JavaScript doesn't care if a key does not exist or if it is undefined,
 * JSON.stringify will show the keys as undefined, so we can faithfully recreate the JSON.
 *
 * https://stackoverflow.com/a/38340374
 *
 * @private
 * @template T
 * @param {T} object The object that will be cleaned.
 * @returns {T} The cleaned object.
 */
function removeEmpty<T>(object: T): T {
    for (const key of Object.keys(object)) {
        if (object[key] && typeof object[key] === 'object') {
            removeEmpty(object[key]);
        } else if (object[key] === undefined) delete object[key];
    }
    return object;
}

/**
 * Helper function for cleaning objects.
 * This is a wrapper to avoid muddying the example from Stack Overflow.
 *
 * @see removeEmpty
 * @private
 * @template T
 * @param {T} object The object that will be cleaned.
 * @returns {T} The cleaned object.
 */
export default function normalizeOutput<T>(object: T): T {
    return removeEmpty(object);
}
