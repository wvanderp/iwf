import Statement from '../Statement';

/**
 * @private
 * @param {Array} a the array that needs to be grouped
 * @param {Function} function_ the function that defines the key
 * @returns {Object} the grouped object
 */
function groupBy<T>(a: T[], function_: (b: T) => string): Record<string, T[]> {
    return a.reduce<Record<string, T[]>>((accumulator, value) => {
        if (accumulator[function_(value)] === undefined) {
            accumulator[function_(value)] = [];
        }

        accumulator[function_(value)].push(value);
        return accumulator;
    }, {});
}

/**
 *
 * @param a
 * @param b
 * @returns
 * @example
 */
export default function mergeStatements(a: Statement[], b: Statement[] = []): Statement[] {
    const grouped = groupBy([...a, ...b], (c) => c.mainsnak.property);

    console.log(grouped);

    return [];
}
