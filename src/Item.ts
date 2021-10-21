import { Item as WikidataItem, LabelAndDescription, Statement as WikidataStatement } from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import Alias from './Alias';
import Statement from './Statement';
import Description from './Description';
import Label from './Label';
import SiteLink from './SiteLink';
import dateFormatter from './utils/dateFormatter';
import normalizeOutput from './utils/normalizeOutput';
import arrayEqual, { arrayEqualWith } from './utils/arrayEqual';

/**
 * @class
 */
export default class Item {
    /** A ID for using things that don't have an ID */
    internalID: string;

    pageid: number;

    ns: number;

    title: string;

    lastrevid: number;

    modified: Date;

    type: 'item';

    id: string;

    labels: Label[];

    descriptions: Description[];

    aliases: Alias[];

    statements: Statement[];

    sitelinks: SiteLink[];

    /**
     *
     * @param {WikidataItem} item the item in json format
     */
    constructor(item: WikidataItem) {
        this.pageid = item.pageid;
        this.ns = item.ns;
        this.title = item.title;
        this.lastrevid = item.lastrevid;
        this.modified = new Date(item.modified);
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
     * this function checks if two items are equal
     *
     * @param {Item} other the other item
     * @returns {boolean} true if the items are equal
     */
    equals(other: Item): boolean {
        const pageidEqual = this.pageid === other.pageid;
        const nsEqual = this.ns === other.ns;
        const titleEqual = this.title === other.title;
        const lastrevidEqual = this.lastrevid === other.lastrevid;
        const modifiedEqual = dateFormatter(this.modified) === dateFormatter(other.modified);
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
     * @returns {WikidataItem} the item as json
     */
    toJSON(): WikidataItem {
        return normalizeOutput({
            pageid: this.pageid,
            ns: this.ns,
            title: this.title,
            lastrevid: this.lastrevid,
            modified: dateFormatter(this.modified),
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
}
