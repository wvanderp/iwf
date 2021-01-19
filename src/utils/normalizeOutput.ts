/* eslint-disable no-param-reassign */
// @ts-nocheck
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object

/**
 * this function removes keys which are undefined.
 * because although javascript doesn't care if a key does not exist of if it is undefined.
 * the JSON.stringify will show the keys as undefined and so we can faithfully recreate the json
 *
 * @private
 * @template T
 * @param {T} object the object that will be cleaned
 * @returns {T} the cleaned object
 */
function removeEmpty<T>(object: T): T {
    Object.keys(object).forEach((key) => {
        if (object[key] && typeof object[key] === 'object') {
            removeEmpty(object[key]);
        } else if (object[key] === undefined) delete object[key];
    });
    return object;
}

/**
 * helper function for cleaning objects.
 * I don't want to muddy the example from stackoverflow so this is a wrapper.
 *
 * @see removeEmpty
 *
 *
 * @private
 * @template T
 * @param {T} object the object that will be cleaned
 * @returns {T} the cleaned object
 */
export default function normalizeOutput<T>(object: T): T {
    return removeEmpty(object);
}
