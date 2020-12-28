"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
// @ts-nocheck
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
function removeEmpty(object) {
    Object.keys(object).forEach((key) => {
        if (object[key] && typeof object[key] === 'object') {
            removeEmpty(object[key]);
        }
        else if (object[key] === undefined)
            delete object[key];
    });
    return object;
}
function normalizeOutput(object) {
    return removeEmpty(object);
}
exports.default = normalizeOutput;
//# sourceMappingURL=normalizeOutput.js.map