import {
    Item as WikidataItem,
    Statement as WikidataStatement,
    LabelAndDescription
} from '@wmde/wikibase-datamodel-types';

import Alias from './Alias';
import Statement from './Statement';
import Description from './Description';
import Label from './Label';
import SiteLink from './SiteLink';
import dateFormatter from './utils/dateFormatter';
import normalizeOutput from './utils/normalizeOutput';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import { Optional } from './types/Optional';
import { Changes } from './utils/diff/Changes';
import labelDiff from './utils/diff/labelDiff';
import aliasDiff from './utils/diff/aliasDiff';
import descriptionDiff from './utils/diff/descriptionDiff';
import statementDiff from './utils/diff/statementsDiff';
import { QString } from './types/strings';
import { isQString } from './utils/guards/strings';
import siteLinkDiff from './utils/diff/siteLinkDiff';
import sha256 from './utils/hash';

/**
 * This type omits the id because if an item is new there will be no id.
 */
type ItemInput = Optional<WikidataItem, 'id'>;

/**
 * Converts an array to a string-keyed object without relying on Object.fromEntries.
 *
 * @param values The values to place in the record.
 * @param getKey Returns the record key for each value.
 * @returns A record keyed by getKey.
 * @example
 *     const byId = arrayToRecord(items, (item) => item.id);
 */
function arrayToRecord<T>(values: T[], getKey: (value: T) => string): Record<string, T> {
    return values.reduce<Record<string, T>>((accumulator, value) => {
        accumulator[getKey(value)] = value;
        return accumulator;
    }, {});
}

/**
 * @class
 */
export default class Item {
    /** A place to store the internalID so that it does not change if the contents of the object change. */
    private _internalID = '';

    /** The id used by Wikibase. */
    pageid: number | undefined;

    /** The namespace the item is located in. */
    ns: number | undefined;

    /** The title of the item. Usually the Q-id of the item. */
    title: string | undefined;

    /** The id of the last revision of the item. */
    lastrevid: number | undefined;

    /** The date of last modification. */
    modified: Date | undefined;

    /** The type of the entity. Always 'item'. */
    type: 'item';

    /** The Q-id of the item. */
    id: QString | undefined;

    /** The labels of the item. */
    labels: Label[];

    /** The descriptions of the item. */
    descriptions: Description[];

    /** The aliases of the item. */
    aliases: Alias[];

    /** The statements of the item. */
    statements: Statement[];

    /** The sitelinks of the item. */
    sitelinks: SiteLink[];

    /**
     * @param item The item in JSON format.
     * @throws {Error} If the id is not a QString.
     * @example
     *     const item = new Item({
     *          type: "item",
     *          id: "q2",
     *          labels: {},
     *          descriptions: {},
     *          aliases: {},
     *          claims: {},
     *          sitelinks: {}
     *     })
     */
    constructor(item: ItemInput) {
        this.pageid = item.pageid;
        this.ns = item.ns;
        this.title = item.title;
        this.lastrevid = item.lastrevid;
        this.modified = item.modified ? new Date(item.modified) : undefined;

        if (item.id !== undefined && !isQString(item.id)) {
            throw new Error(`The ID provided for the item is not a QString. It was ${item.id}`);
        }
        this.id = item.id;

        this.type = item.type;

        this.labels = Object.values(item.labels).map((label) => new Label(label));
        this.descriptions = Object.values(item.descriptions).map((description) => new Description(description));
        this.aliases = Object.values(item.aliases)
            .flatMap(
                (alias) => (alias == null ? [] : alias.map((alias2) => new Alias(alias2)))
            );

        this.statements = Object.values(item.claims)
            .flat()
            .map((statement) => new Statement(statement));

        this.sitelinks = Object.values(item.sitelinks).map((siteLink) => new SiteLink(siteLink));
    }

    /**
     * Creates a unique id for the Item.
     *
     * @returns The id.
     */
    public get internalID(): string {
        if (this._internalID === '') {
            this._internalID = sha256(JSON.stringify(this.toJSON()));
        }

        return this._internalID;
    }

    /**
     * Tries to find a label in the requested language.
     * If the `default for all languages` (mul) label is present, it will return that one.
     * If none can be found, it will return undefined.
     *
     * @param language The language of the label.
     * @returns The label if it found one or undefined.
     * @example
     *      const label = item.findLabel("nl")
     *      console.log(label.value)
     *      // Douglas Adams
     */
    findLabel(language: string): Label | undefined {
        const foundLabel = this.labels.find((label) => label.language === language);
        if (foundLabel) {
            return foundLabel;
        }
        return this.labels.find((label) => label.language === 'mul');
    }

    /**
     * Tries to find a description in the requested language.
     * If none can be found, it will return undefined.
     *
     * @param language The language of the description.
     * @returns The description if it found one or undefined.
     * @example
     *      const description = item.findDescription('en')
     *      console.log(description?.value)
     */
    findDescription(language: string): Description | undefined {
        return this.descriptions.find((description) => description.language === language);
    }

    /**
     * Finds all aliases in the requested language.
     * If none are present for the requested language, it will fall back to aliases with language 'mul'.
     * Returns an empty array when no aliases match.
     *
     * @param language The language of the aliases.
     * @returns All aliases in the requested language (or 'mul' fallback), or an empty array.
     * @example
     *      const aliases = item.findAliases('en')
     *      console.log(aliases.map(a => a.value))
     */
    findAliases(language: string): Alias[] {
        const found = this.aliases.filter((alias) => alias.language === language);
        if (found.length > 0) return found;
        return this.aliases.filter((alias) => alias.language === 'mul');
    }

    /**
     * Adds a statement to the item.
     *
     * @param statement The statement to add.
     * @example
     *   const statement = Statement.fromSnak(URLSnak.fromURL("p1", "https://www.wikidata.org"))
     *   item.addStatement(statement)
     */
    addStatement(statement: Statement | Statement[]): void {
        if (Array.isArray(statement)) {
            this.statements.push(...statement);
        } else {
            this.statements.push(statement);
        }
    }

    /**
     * Removes a statement from the item.
     *
     * @see removeStatements
     * @param statement The statement to remove.
     * @example
     *     const statement = item.statements[0]
     *     item.removeStatement(statement)
     */
    removeStatement(statement: Statement): void {
        const index = this.statements.findIndex((statement2) => statement2.equals(statement));
        if (index !== -1) {
            this.statements.splice(index, 1);
        }
    }

    /**
     * Removes multiple statements from the item.
     *
     * @see removeStatement
     * @param statements The statements to remove.
     * @example
     *   const statements = item.statements
     *   item.removeStatements(statements)
     */
    removeStatements(statements: Statement[]): void {
        for (const statement of statements) this.removeStatement(statement);
    }

    /**
     * Checks if two items are equal.
     *
     * @param other The other item.
     * @returns True if the items are equal.
     * @example
     *      const itemA = Item.fromNothing()
     *      const itemB = Item.fromNothing()
     *
     *      if(itemA.equals(itemB)){
     *          alert('the items are the same');
     *      }
     */
    equals(other: Item): boolean {
        const pageidEqual = this.pageid === other.pageid;
        const nsEqual = this.ns === other.ns;
        const titleEqual = this.title === other.title;
        const lastrevidEqual = this.lastrevid === other.lastrevid;

        let modifiedEqual: boolean;
        if (this.modified === undefined && other.modified === undefined) {
            modifiedEqual = true;
        } else if (this.modified === undefined || other.modified === undefined) {
            modifiedEqual = false;
        } else {
            modifiedEqual = dateFormatter(this.modified) === dateFormatter(other.modified);
        }

        const idEqual = this.id === other.id;
        const typeEqual = this.type === other.type;

        const labelsEqual = arrayEqual(this.labels, other.labels);
        const descriptionsEqual = arrayEqual(this.descriptions, other.descriptions);
        const aliasesEqual = arrayEqual(this.aliases, other.aliases);

        const statementsEqual = arrayEqualWith(this.statements, other.statements, (a, b) => a.equals(b));

        return pageidEqual
            && nsEqual
            && titleEqual
            && lastrevidEqual
            && modifiedEqual
            && idEqual
            && typeEqual
            && labelsEqual
            && descriptionsEqual
            && aliasesEqual
            && statementsEqual;
    }

    /**
     * Finds the difference between two items.
     *
     * @param other The other item.
     * @returns The changes between the two items.
     * @example
     *   const itemA = Item.fromNothing()
     *   const itemB = Item.fromNothing()
     *   itemA.addLabel(new Label({language: "nl", value: "Douglas Adams"}))
     *
     *   const changes = itemA.diff(itemB)
     *   console.log(changes)
     */
    diff(other: Item): Changes[] {
        const labelChanges = labelDiff(this.labels, other.labels, this.id ?? 'unknown');
        const descriptionsChanges = descriptionDiff(this.descriptions, other.descriptions, this.id ?? 'unknown');
        const aliasesChanges = aliasDiff(this.aliases, other.aliases, this.id ?? 'unknown');

        const statementsChanges = statementDiff(this.statements, other.statements, this.id ?? 'unknown');
        const sitelinksChanges = siteLinkDiff(this.sitelinks, other.sitelinks, this.id ?? 'unknown');

        return [...labelChanges, ...descriptionsChanges, ...aliasesChanges, ...statementsChanges, ...sitelinksChanges];
    }

    /**
     * Stringifies the Item into the same JSON format as the API.
     *
     * @returns The item as JSON.
     * @example
     *      const json = item.toJSON();
     */
    toJSON(): WikidataItem {
        return normalizeOutput({
            pageid: this.pageid,
            ns: this.ns,
            title: this.title,
            lastrevid: this.lastrevid,
            modified: this.modified && dateFormatter(this.modified),
            type: this.type,
            id: this.id,

            labels: arrayToRecord(
                this.labels.map((label) => label.toJSON()),
                (value) => value.language
            ),

            descriptions: arrayToRecord(
                this.descriptions.map((description) => description.toJSON()),
                (value) => value.language
            ),

            aliases: this.aliases
                .map((alias) => alias.toJSON())
                .reduce<Record<string, LabelAndDescription[]>>((accumulator, value) => {
                    if (!(value.language in accumulator)) {
                        accumulator[value.language] = [];
                    }

                    accumulator[value.language].push(value);
                    return accumulator;
                }, {}),

            claims: this.statements
                .map((statement) => statement.toJSON())
                .reduce<Record<string, WikidataStatement[]>>((accumulator, value) => {
                    if (!(value.mainsnak.property in accumulator)) {
                        accumulator[value.mainsnak.property] = [];
                    }

                    accumulator[value.mainsnak.property].push(value);
                    return accumulator;
                }, {}),

            sitelinks: arrayToRecord(
                this.sitelinks.map((siteLink) => siteLink.toJSON()),
                (value) => value.site
            )

        }) as WikidataItem;
    }

    /**
     * Generates a new empty item object.
     *
     * @returns Returns an empty item.
     * @example
     *      const newItem = Item.fromNothing()
     */
    static fromNothing(): Item {
        return new Item({
            type: 'item',
            id: undefined,
            labels: {},
            descriptions: {},
            aliases: {},
            claims: {},
            sitelinks: {}
        });
    }
}
