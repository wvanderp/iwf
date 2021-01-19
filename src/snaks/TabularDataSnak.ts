import {TabularDataSnak as WikidataTabularDataSnak} from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import normalizeOutput from '../utils/normalizeOutput';

/**
 * class for the TabularDataSnak
 *
 * most used property of this type P4150 (weather history)
 *
 * @class
 */
export default class TabularDataSnak extends Snak {
    value: string | undefined

    datatype = 'tabular-data';

    /**
     * @param {WikidataTabularDataSnak} snak the snak for this class in json format
     */
    constructor(snak: WikidataTabularDataSnak) {
        super(snak);

        this.value = snak.datavalue?.value;
    }

    /**
     * gets the link to the wiki commons page
     *
     * @returns {string} the link to the wiki commons page
     */
    public get commonsLink() : string {
        return `https://commons.wikimedia.org/wiki/${this.value}`;
    }

    /**
     *
     * @returns {WikidataTabularDataSnak} the snak as json
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
     * this function checks if two snaks are equal
     *
     * @static
     * @param {TabularDataSnak} a snak a
     * @param {TabularDataSnak} b snak b
     * @returns {boolean} true if the snaks are equal
     */
    static equals(a:TabularDataSnak, b:TabularDataSnak): boolean {
        return a.value === b.value;
    }
}
