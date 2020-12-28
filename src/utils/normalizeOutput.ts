/* eslint-disable no-param-reassign */
// @ts-nocheck
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
function removeEmpty<T>(object: T): T {
    Object.keys(object).forEach((key) => {
        if (object[key] && typeof object[key] === 'object') {
            removeEmpty(object[key]);
        } else if (object[key] === undefined) delete object[key];
    });
    return object;
}

export default function normalizeOutput<T>(object: T): T {
    return removeEmpty(object);
}
