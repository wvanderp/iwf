"use strict";
/* eslint-disable no-param-reassign */
// @ts-nocheck
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
Object.defineProperty(exports, "__esModule", { value: true });
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
function removeEmpty(object) {
    for (const key of Object.keys(object)) {
        if (object[key] && typeof object[key] === 'object') {
            removeEmpty(object[key]);
        }
        else if (object[key] === undefined)
            delete object[key];
    }
    return object;
}
/**
 * helper function for cleaning objects.
 * I don't want to muddy the example from stackoverflow so this is a wrapper.
 *
 * @see removeEmpty
 * @private
 * @template T
 * @param {T} object the object that will be cleaned
 * @returns {T} the cleaned object
 */
function normalizeOutput(object) {
    return removeEmpty(object);
}
exports.default = normalizeOutput;
//# sourceMappingURL=normalizeOutput.js.map