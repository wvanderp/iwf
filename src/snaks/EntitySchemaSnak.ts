import { EntitySchemaSnak as WikidataEntitySchemaSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { EString, PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'entity-schema';

/**
 * Class for the EntitySchemaSnak
 *
 * Most used property of this type ...
 *
 * @class
 */
export default class EntitySchemaSnak extends Snak {
    private _numericID: number | undefined;

    datatype = dataType;

    /**
     * @param {WikidataEntitySchemaSnak} snak the snak for this class in json format
     * @example
     *  const snak = new EntitySchemaSnak(json);
     */
    constructor(snak: WikidataEntitySchemaSnak) {
        super(snak);

        // the ID is prefixed with E so we need to remove it
        this._numericID = snak.datavalue?.value.id
            ? Number.parseInt(snak.datavalue.value.id.slice(1), 10)
            : undefined;
    }

    /**
     * the value will be prefixed with E
     *
     * @alias id
     * @returns {string | undefined} the value of the snak
     */
    get id(): string | undefined {
        return this.hasValue ? `E${this._numericID}` : undefined;
    }

    /**
     * @alias id
     * @param {string | undefined} value the value of the snak
     */
    set id(value: string | undefined) {
        if (value === undefined) {
            this._numericID = undefined;
            this.snaktype = 'novalue';
            return;
        }

        this._numericID = Number.parseInt(value.slice(1), 10);
    }

    /**
     * @alias numericID
     * @returns {number | undefined} the value of the snak
     */
    get numericID(): number | undefined {
        return this._numericID;
    }

    /**
     * @alias numericID
     * @param {number | undefined} value the value of the snak
     */
    set numericID(value: number | undefined) {
        this._numericID = value;
    }

    /**
     *
     * @returns {WikidataEntitySchemaSnak} the snak as json
     * @example
     *      const json = EntitySchemaSnak.toJson();
     */
    toJSON(): WikidataEntitySchemaSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    id: `E${this._numericID}`,
                    'entity-type': dataType
                },
                type: 'wikibase-entityid' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * this function checks if two snaks are equal
     *
     * @param {EntitySchemaSnak} other the other snak
     * @returns {boolean} true if the snaks are equal
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: EntitySchemaSnak): boolean {
        return this._numericID === other._numericID && this.property === other.property;
    }

    /**
     * create a snak from a property and a id string
     *
     * @static
     * @param {PString} property the property of the snak in 'P-form'
     * @param {EString} id the entity schema id
     * @returns {EntitySchemaSnak} a snak with the given properties
     * @example
     *   const snak = EntitySchemaSnak.fromID('P698', 'E12345678');
     */
    static fromID(property: PString, id: EString): EntitySchemaSnak {
        return new EntitySchemaSnak({
            snaktype: 'value',
            property,
            datatype: dataType,
            datavalue: {
                value: {
                    id,
                    'entity-type': dataType
                },
                type: 'wikibase-entityid'
            }
        });
    }
}
