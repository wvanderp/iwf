import type { z } from 'zod';
import { SnakSchema, SnaksSchema } from '@wvanderp/wikibase-datamodel-types/zod';

import { Snaks as WikidataSnaks, SnakType as WikidataSnakType } from './types/wikidata';
import { PString } from './types/strings';
import { isPString } from './utils/guards/strings';
import sha256 from './utils/hash';

/**
 * @abstract
 * @class
 * Represents a Snak in the Wikidata model.
 */
export default abstract class Snak {
    /** A place to store the internalID so that it does not change if the contents of the object change. */
    private _internalID = '';

    snaktype: WikidataSnakType;

    property: PString;

    hash: string | undefined;

    abstract datatype: string;

    /**
     * Creates an instance of Snak.
     *
     * @param snak - The snak in a JSON format.
     * @param schema The upstream schema for the concrete snak class; defaults to the supported snak union for custom subclasses.
     * @throws {Error} If the input fails schema validation, or a value snak has no datavalue.
     * @example
     * const snak = new Snak(json);
     */
    constructor(snak: WikidataSnaks, schema: z.ZodType<WikidataSnaks> = SnaksSchema) {
        const result = schema.safeParse(snak);
        if (!result.success) {
            const { property, datatype } = SnakSchema.parse(snak);
            const details = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
            throw new Error(`Invalid datavalue.type or value for ${property} (datatype "${datatype}"): ${details}`);
        }
        // Upstream schemas allow an omitted datavalue for all snak types.
        // This library requires it when the snak declares an actual value.
        if (snak.snaktype === 'value' && snak.datavalue === undefined) {
            throw new Error(`Missing datavalue.type and value for ${snak.property}.`);
        }

        this.snaktype = snak.snaktype;

        if (isPString(snak.property)) {
            this.property = snak.property;
        } else {
            throw new Error('Property is not a PString');
        }

        this.hash = snak.hash;
    }

    /**
     * Checks if the snak has a value.
     *
     * @returns True if the snak has a value.
     */
    public get hasValue(): boolean {
        return this.snaktype === 'value';
    }

    /**
     * Creates a unique ID for the Snak.
     *
     * @returns The ID.
     */
    public get internalID(): string {
        if (this._internalID === '') {
            this._internalID = sha256(JSON.stringify(this.toJSON()));
        }

        return this._internalID;
    }

    /**
     * Converts the Snak to a JSON object.
     *
     * @returns {WikidataSnaks} The JSON representation of the Snak.
     */
    abstract toJSON(): WikidataSnaks;

    /**
     * Checks if this Snak is equal to another Snak.
     *
     * @param {Snak} other - The other Snak to compare with.
     * @returns {boolean} True if the Snaks are equal.
     */
    abstract equals(other: Snak): boolean;
}
