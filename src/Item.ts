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
import { v4 as uuidv4 } from 'uuid';

import Alias from './Alias';
import Statement from './Statement';
import Description from './Description';
import Label from './Label';
import SiteLink from './SiteLink';
import dateFormatter from './utils/dateFormatter';
import normalizeOutput from './utils/normalizeOutput';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import { Optional } from './types/Optional';

/**
 * this type omits the id because if an item is new there will be no id
 */
type ItemInput = Optional<WikidataItem, 'id'>

/**
 * @class
 */
export default class Item {
    /** A ID for using things that don't have an ID */
    internalID: string;

    /** the id used by wikibase */
    pageid: number | undefined;

    /** the namespace the item is located in */
    ns: number | undefined;

    /** the title of the item. Usually the Q-id of the item */
    title: string | undefined;

    /** the id of the last revision of the item */
    lastrevid: number | undefined;

    /** the date of last modified */
    modified: Date | undefined;

    /** the type of the entity. always 'item' */
    type: 'item';

    /** the Q-id of the item */
    id: string | undefined;

    /** the labels of the item */
    labels: Label[];

    /** the descriptions of the item */
    descriptions: Description[];

    /** the aliases of the item */
    aliases: Alias[];

    /** the statements of the item */
    statements: Statement[];

    /** the sitelinks of the item */
    sitelinks: SiteLink[];

    /**
     *
     * @param {ItemInput} item the item in json format
     * @example
     */
    constructor(item: ItemInput) {
        this.pageid = item.pageid;
        this.ns = item.ns;
        this.title = item.title;
        this.lastrevid = item.lastrevid;
        this.modified = item.modified ? new Date(item.modified) : undefined;
        this.id = item.id;

        this.type = item.type;
        this.internalID = uuidv4();

        this.labels = Object.values(item.labels).map((label) => new Label(label));
        this.descriptions = Object.values(item.descriptions).map((description) => new Description(description));
        this.aliases = Object.values(item.aliases)
            .flatMap(
                (alias) => (alias !== null ? alias.map((alias2) => new Alias(alias2)) : [])
            );

        this.statements = Object.values(item.claims)
            .flat()
            .map((statement) => new Statement(statement));

        this.sitelinks = Object.values(item.sitelinks).map((siteLink) => new SiteLink(siteLink));
    }

    /**
     * tries to find a label int the requested language.
     * if non can be found, it will return undefined
     *
     * @param {string} language the language of the label
     * @returns {Label | undefined} the labelA label if it found one or undefined
     * @example
     *      const label = item.findLabel("nl")
     *      console.log(label.value)
     *      // Douglas Adams
     */
    findLabel(language: string) {
        return this.labels.find((label) => label.language === language);
    }

    /**
     * this function checks if two items are equal
     *
     * @param {Item} other the other item
     * @returns {boolean} true if the items are equal
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
            // @ts-expect-error
            : dateFormatter(this.modified) === dateFormatter(other.modified);
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
     *
     * @param other the other item
     */
    // diff(other: Item): Changes[] {
    //     const labelChanges = labelDiff(this.labels, other.labels);
    //     const descriptionsChanges = descriptionsDiff(this.descriptions, other.descriptions);
    //     const aliasesChanges = aliasDiff(this.aliases, other.aliases);

    //     const statementsChanges = statementsDiff(this.statements, other.statements);
    //     const sitelinksChanges = siteLinksDiff(this.sitelinks, other.sitelinks);

    //     return [...labelChanges, ...descriptionsChanges, ...aliasesChanges, ...statementsChanges, ...sitelinksChanges];
    // }

    /**
     * stringifies the Item into the same json format as the api
     *
     * @returns {WikidataItem} the item as json
     * @example
     *      const json = item.toJson();
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

            labels: this.labels
                .map((label) => label.toJSON())
                .reduce((accumulator, value) => ({ ...accumulator, [value.language]: value }), {}),

            descriptions: this.descriptions
                .map((description) => description.toJSON())
                .reduce((accumulator, value) => ({ ...accumulator, [value.language]: value }), {}),

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

            sitelinks: this.sitelinks
                .map((siteLink) => siteLink.toJSON())
                .reduce((accumulator, value) => ({ ...accumulator, [value.site]: value }), {})

        }) as WikidataItem;
    }

    /**
     * generates a new empty item object
     *
     * @returns {Item} returns a empty item
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
