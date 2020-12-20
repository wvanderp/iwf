"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addZero(number) {
    return number.toString().length === 1 ? `0${number}` : `${number}`;
}
function dateFormatter(date) {
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getUTCDate())}T${addZero(date.getUTCHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}Z`;
}
exports.default = dateFormatter;
//# sourceMappingURL=DateFormater.js.map