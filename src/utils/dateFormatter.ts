/**
 * adds a zero to the from of a number if it is between 0 and 10
 *
 * @private
 * @param {number} number the number that needs to be formatted
 * @returns {string} the number with or without the leading zero
 */
function addZero(number: number): string {
    return number.toString().length === 1 ? `0${number}` : `${number}`;
}

/**
 * formats a given date as a date that is compatible with wikidata
 *
 * @private
 * @param {Date} date the date that will be formatted
 * @returns {string} the formatted date
 */
export default function dateFormatter(date: Date): string {
    // eslint-disable-next-line max-len
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getUTCDate())}T${addZero(date.getUTCHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}Z`;
}
