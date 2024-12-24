/**
 * Adds a zero to the front of a number if it is between 0 and 10.
 *
 * @private
 * @param {number} number The number that needs to be formatted.
 * @returns {string} The number with or without the leading zero.
 */
function addZero(number: number): string {
    return number.toString().length === 1 ? `0${number}` : `${number}`;
}

/**
 * Formats a given date as a date that is compatible with Wikidata.
 *
 * @private
 * @param {Date} date The date that will be formatted.
 * @returns {string} The formatted date.
 */
export default function dateFormatter(date: Date): string {
    // eslint-disable-next-line max-len
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getUTCDate())}T${addZero(date.getUTCHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}Z`;
}
