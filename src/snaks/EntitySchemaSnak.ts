import { EntitySchemaSnak as WikidataEntitySchemaSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
import { EString, PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'entity-schema';

/**
 * Class for the EntitySchemaSnak.
 *
 * Most used property of this type ...
 *
 * @class
 */
export default class EntitySchemaSnak extends Snak {
    private _numericID: number | undefined;

    datatype = dataType;

    /**
     * @param {WikidataEntitySchemaSnak} snak The snak for this class in JSON format.
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
     * The value will be prefixed with E.
     *
     * @alias id
     * @returns {string | undefined} The value of the snak.
     */
    get id(): string | undefined {
        return this.hasValue ? `E${this._numericID}` : undefined;
    }

    /**
     * @alias id
     * @param {string | undefined} value The value of the snak.
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
     * @returns {number | undefined} The value of the snak.
     */
    get numericID(): number | undefined {
        return this._numericID;
    }

    /**
     * @alias numericID
     * @param {number | undefined} value The value of the snak.
     */
    set numericID(value: number | undefined) {
        this._numericID = value;
    }

    /**
     * @returns {WikidataEntitySchemaSnak} The snak as JSON.
     * @example
     *      const json = EntitySchemaSnak.toJSON();
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
     * This function checks if two snaks are equal.
     *
     * @param {EntitySchemaSnak} other The other snak.
     * @returns {boolean} True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: EntitySchemaSnak): boolean {
        return this._numericID === other._numericID && this.property === other.property;
    }

    /**
     * Create a snak from a property and an ID string.
     *
     * @static
     * @param {PString} property The property of the snak in 'P-form'.
     * @param {EString} id The entity schema ID.
     * @returns {EntitySchemaSnak} A snak with the given properties.
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
