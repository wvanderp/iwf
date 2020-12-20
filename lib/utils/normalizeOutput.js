"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
function removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            removeEmpty(obj[key]);
        }
        else if (obj[key] === undefined)
            delete obj[key];
    });
    return obj;
}
;
function normalizeOutput(object) {
    return removeEmpty(object);
}
exports.default = normalizeOutput;
//# sourceMappingURL=normalizeOutput.js.map