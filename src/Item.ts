import { Item as WikidataItem, LabelAndDescription, Statement as WikidataStatement } from '@wmde/wikibase-datamodel-types';
import { v4 as uuidv4 } from 'uuid';

import Alias from './Alias';
import Statement from './Statement';
import Description from './Description';
import Label from './Label';
import SiteLink from './SiteLink';
import dateFormatter from './utils/dateFormatter';
import normalizeOutput from './utils/normalizeOutput';

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

    sitelinks: SiteLink[]

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
                .reduce((accumulator, value) => ({...accumulator, [value.language]: value}), {}),

            descriptions: this.descriptions
                .map((description) => description.toJSON())
                .reduce((accumulator, value) => ({...accumulator, [value.language]: value}), {}),

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
                .reduce((accumulator, value) => ({...accumulator, [value.site]: value}), {})

        }) as WikidataItem;
    }
}
