import { TabularDataSnak as WikidataTabularDataSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * Class for the TabularDataSnak.
 *
 * Most used property of this type is P4150 (weather history).
 *
 * @class
 */
export default class TabularDataSnak extends Snak {
    value: string | undefined;

    datatype = 'tabular-data';

    /**
     * @param {WikidataTabularDataSnak} snak The snak for this class in JSON format.
     * @example
     *      const snak = new TabularDataSnak(json);
     */
    constructor(snak: WikidataTabularDataSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     * Gets the link to the Wiki Commons page.
     *
     * @returns {string} The link to the Wiki Commons page.
     */
    public get commonsLink(): string {
        return `https://commons.wikimedia.org/wiki/${this.value}`;
    }

    /**
     *
     * @returns {WikidataTabularDataSnak} The snak as JSON.
     * @example
     *      const json = tabularSnak.toJSON();
     */
    toJSON(): WikidataTabularDataSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: this.value,
                type: 'string'
            } : undefined,
            datatype: this.datatype
        }) as WikidataTabularDataSnak;
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param {TabularDataSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: TabularDataSnak): boolean {
        return this.value === other.value && this.property === other.property;
    }
}
