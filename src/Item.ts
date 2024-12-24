import {
    Item as WikidataItem,
    Labels as WikidataLabels,
    Statement as WikidataStatement,
    Descriptions as WikidataDescriptions,
    Aliases as WikidataAliases,
    StatementMap as WikidataClaims,
    Sitelinks as WikidataSiteLinks,
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
     * @param {ItemInput} item The item in JSON format.
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
     * @returns {string} The id.
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
     * @param {string} language The language of the label.
     * @returns {Label | undefined} The label if it found one or undefined.
     * @example
     *      const label = item.findLabel("nl")
     *      console.log(label.value)
     *      // Douglas Adams
     */
    findLabel(language: string): Label | undefined {
        const label = this.labels.find((label) => label.language === language);
        if (label) {
            return label;
        }
        return this.labels.find((label) => label.language === 'mul');
    }

    /**
     * Adds a statement to the item.
     *
     * @param {Statement | Statement[]} statement The statement to add.
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
     * @param {Statement} statement The statement to remove.
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
     * @param {Statement[]} statements The statements to remove.
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
     * @param {Item} other The other item.
     * @returns {boolean} True if the items are equal.
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
        const modifiedEqual = (this.modified === undefined && other.modified === undefined)
            ? true
            : ((this.modified === undefined || other.modified === undefined)
                ? false
                : dateFormatter(this.modified) === dateFormatter(other.modified));
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
     * @param {Item} other The other item.
     * @returns {Changes[]} The changes between the two items.
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
     * @returns {WikidataItem} The item as JSON.
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

            labels: Object.fromEntries(this.labels
                .map((label) => label.toJSON())
                .map((value) => [value.language, value])),

            descriptions: Object.fromEntries(this.descriptions
                .map((description) => description.toJSON())
                .map((value) => [value.language, value])),

            aliases: this.aliases
                .map((alias) => alias.toJSON())
                .reduce<Record<string, LabelAndDescription[]>>((accumulator, value) => {
                if (accumulator[value.language] === undefined) {
                    accumulator[value.language] = [];
                }

                accumulator[value.language].push(value);
                return accumulator;
            }, {}),

            claims: this.statements
                .map((statement) => statement.toJSON())
                .reduce<Record<string, WikidataStatement[]>>((accumulator, value) => {
                if (accumulator[value.mainsnak.property] === undefined) {
                    accumulator[value.mainsnak.property] = [];
                }

                accumulator[value.mainsnak.property].push(value);
                return accumulator;
            }, {}),

            sitelinks: Object.fromEntries(this.sitelinks
                .map((siteLink) => siteLink.toJSON())
                .map((value) => [value.site, value]))

        }) as WikidataItem;
    }

    /**
     * Generates a new empty item object.
     *
     * @returns {Item} Returns an empty item.
     * @example
     *      const newItem = Item.fromNothing()
     */
    static fromNothing(): Item {
        return new Item({
            type: 'item',
            id: undefined,
            labels: {} as WikidataLabels,
            descriptions: {} as WikidataDescriptions,
            aliases: {} as WikidataAliases,
            claims: {} as WikidataClaims,
            sitelinks: {} as WikidataSiteLinks
        });
    }
}
