import { WikibaseFormSnak as WikidataWikibaseFormSnak } from '@wvanderp/wikibase-datamodel-types';

import Snak from '../Snak';
import { FormString, PString } from '../types/strings';
import normalizeOutput from '../utils/normalizeOutput';

const dataType = 'wikibase-form';

const formIdRegex = /^L(\d+)-F(\d+)$/;

/**
 * Splits a form ID (L{number}-F{number}) into its lexeme and form parts.
 *
 * @param id The form ID.
 * @returns The numeric lexeme and form IDs, or undefined for both when the ID is not a valid form ID.
 * @example
 *    parseFormId('L123-F4'); // { lexemeId: 123, formId: 4 }
 */
function parseFormId(id: string | undefined): { lexemeId: number | undefined; formId: number | undefined } {
    const match = id === undefined ? null : formIdRegex.exec(id);

    if (match === null) {
        return { lexemeId: undefined, formId: undefined };
    }

    return {
        lexemeId: Number.parseInt(match[1], 10),
        formId: Number.parseInt(match[2], 10)
    };
}

/**
 * Class for the WikibaseFormSnak.
 *
 * A form is a grammatical variant of a lexeme, for example "books" as the plural form of the lexeme "book".
 * An example of a property of this type is P5830 (demonstrates form).
 *
 * @class
 */
export default class WikibaseFormSnak extends Snak {
    private _lexemeId: number | undefined;

    private _formId: number | undefined;

    datatype = dataType;

    /**
     * @param snak The snak for this class in JSON format.
     * @example
     *  const snak = new WikibaseFormSnak(json);
     */
    constructor(snak: WikidataWikibaseFormSnak) {
        super(snak);

        const { lexemeId, formId } = parseFormId(snak.datavalue?.value.id);
        this._lexemeId = lexemeId;
        this._formId = formId;
    }

    /**
     * The form ID will take the form L{number}-F{number}.
     *
     * @alias id
     * @returns The value of the snak.
     */
    public get id(): string | undefined {
        return this.hasValue ? `L${this._lexemeId}-F${this._formId}` : undefined;
    }

    /**
     * @alias id
     * @param value The value of the snak.
     */
    public set id(value: string | undefined) {
        if (value === undefined) {
            this._lexemeId = undefined;
            this._formId = undefined;
            this.snaktype = 'novalue';
            return;
        }

        const { lexemeId, formId } = parseFormId(value);

        if (lexemeId === undefined || formId === undefined) {
            throw new Error(`${value} is not a valid form ID (expected L{number}-F{number})`);
        }

        this._lexemeId = lexemeId;
        this._formId = formId;
    }

    /**
     * @alias lexemeId
     * @returns The numeric ID of the lexeme the form belongs to.
     */
    public get lexemeId(): number | undefined {
        return this._lexemeId;
    }

    /**
     * @alias lexemeId
     * @param value The numeric ID of the lexeme the form belongs to.
     */
    public set lexemeId(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._lexemeId = value;
    }

    /**
     * @alias formId
     * @returns The numeric ID of the form within the lexeme.
     */
    public get formId(): number | undefined {
        return this._formId;
    }

    /**
     * @alias formId
     * @param value The numeric ID of the form within the lexeme.
     */
    public set formId(value: number | undefined) {
        if (value === undefined) {
            this.snaktype = 'novalue';
        }

        this._formId = value;
    }

    /**
     * @returns The snak as JSON.
     * @example
     *      const json = WikibaseFormSnak.toJSON();
     */
    toJSON(): WikidataWikibaseFormSnak {
        return normalizeOutput({
            snaktype: this.snaktype,
            property: this.property,
            hash: this.hash,
            datavalue: this.hasValue ? {
                value: {
                    'entity-type': 'form' as const,
                    id: `L${this._lexemeId}-F${this._formId}`
                },
                type: 'wikibase-entityid' as const
            } : undefined,
            datatype: dataType
        });
    }

    /**
     * This function checks if two snaks are equal.
     *
     * @param other The other snak.
     * @returns True if the snaks are equal.
     * @example
     *    if (snak.equals(other)) {
     *     // do something
     *   }
     */
    equals(other: WikibaseFormSnak): boolean {
        return this._lexemeId === other._lexemeId
            && this._formId === other._formId
            && this.property === other.property;
    }

    /**
     * Create a new instance of the class from some basic data.
     *
     * @static
     * @param property The property of the snak in 'P-form'.
     * @param id The form ID in 'L{number}-F{number}' form.
     * @returns A new instance of the class.
     * @example
     *    const snak = WikibaseFormSnak.fromData('P5830', 'L123-F4');
     */
    static fromData(property: PString, id: FormString): WikibaseFormSnak {
        return new WikibaseFormSnak({
            snaktype: 'value',
            property,
            datatype: dataType,
            datavalue: {
                value: {
                    'entity-type': 'form',
                    id
                },
                type: 'wikibase-entityid'
            }
        });
    }
}
