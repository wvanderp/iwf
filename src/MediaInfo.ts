import {
    Labels as WikidataLabels,
    Statement as WikidataStatement,
    Descriptions as WikidataDescriptions,
    StatementMap as WikidataClaims,
    Mediainfo as WikidataMediainfo
} from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import Statement from './Statement';
import Description from './Description';
import Label from './Label';
import dateFormatter from './utils/dateFormatter';
import normalizeOutput from './utils/normalizeOutput';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';
import { Optional } from './types/Optional';
import ItemLike from './ItemLike';

/**
 * this type omits the id because if an item is new there will be no id
 */
type ItemInput = Optional<WikidataMediainfo, 'id'>;

/**
 * @class
 */
export default class MediaInfo extends ItemLike {
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
    type: 'mediainfo';

    /** the Q-id of the item */
    id: string | undefined;

    /** the labels of the item */
    labels: Label[];

    /** the descriptions of the item */
    descriptions: Description[];

    /** the statements of the item */
    statements: Statement[];

    /**
     *
     * @param {ItemInput} item the item in json format
     * @example
     */
    constructor(item: ItemInput) {
        super();
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

        this.statements = Object.values(item.statements)
            .flat()
            .map((statement) => new Statement(statement));
    }

    /**
     *
     * @returns {string} the url leading to the commons page
     */
    get commonsUrl(): string {
        return `https://commons.wikimedia.org/entity/${this.id}`;
    }

    /**
     * gets the link to the image.
     * uses the special:redirect function of wiki commons to find the right url
     *
     * @returns {string} the link to the image
     */
    public get imageLink(): string {
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${this.title}`;
    }

    /**
     * this function checks if two items are equal
     *
     * @param {MediaInfo} other the other item
     * @returns {boolean} true if the items are equal
     * @example
     *      const itemA = Item.fromNothing()
     *      const itemB = Item.fromNothing()
     *
     *      if(itemA.equals(itemB)){
     *          alert('the items are the same');
     *      }
     */
    equals(other: MediaInfo): boolean {
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
     * @returns {WikidataMediainfo} the item as json
     * @example
     *      const json = item.toJson();
     */
    toJSON(): WikidataMediainfo {
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

            statements: this.statements
                .map((statement) => statement.toJSON(true))
                .reduce<Record<string, WikidataStatement[]>>((accumulator, value) => {
                    if (accumulator[value.mainsnak.property] === undefined) {
                        accumulator[value.mainsnak.property] = [];
                    }

                    accumulator[value.mainsnak.property].push(value);
                    return accumulator;
            }, {}),
        }) as WikidataMediainfo;
    }

    /**
     * generates a new empty item object
     *
     * @returns {MediaInfo} returns a empty item
     * @example
     *      const newItem = Item.fromNothing()
     */
    static fromNothing(): MediaInfo {
        return new MediaInfo({
            type: 'mediainfo',
            id: undefined,
            labels: {} as WikidataLabels,
            descriptions: {} as WikidataDescriptions,
            statements: {} as WikidataClaims
        });
    }
}
