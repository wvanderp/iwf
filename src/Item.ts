import { Item as WikidataItem, LabelAndDescription, Statement as WikidataClaim } from '@wmde/wikibase-datamodel-types';

import Alias from './Alias';
import Claim from './Claim';
import Description from './Description';
import Label from './Label';
import SideLink from './SideLink';
import dateFormatter from './utils/DateFormater';
import normalizeOutput from './utils/normalizeOutput';

export default class Item {
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

    claims: Claim[];

    sitelinks: SideLink[]

    constructor(item: WikidataItem) {
        this.pageid = item.pageid;
        this.ns = item.ns;
        this.title = item.title;
        this.lastrevid = item.lastrevid;
        this.modified = new Date(item.modified);
        this.id = item.id;

        this.type = item.type;

        this.labels = Object.values(item.labels).map((label) => new Label(label));
        this.descriptions = Object.values(item.descriptions).map((description) => new Description(description));
        this.aliases = Object.values(item.aliases)
            .map(
                (alias) => (alias !== null ? alias.map((alias2) => new Alias(alias2)) : [])
            )
            .flat();

        this.claims = Object.values(item.claims)
            .flat()
            .map((claim) => new Claim(claim));

        this.sitelinks = Object.values(item.sitelinks).map((sitelink) => new SideLink(sitelink));
    }

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

            claims: this.claims
                .map((claim) => claim.toJSON())
                .reduce<Record<string, WikidataClaim[]>>((accumulator, value) => {
                    if (accumulator[value.mainsnak.property] === undefined) {
                        accumulator[value.mainsnak.property] = [];
                    }

                    accumulator[value.mainsnak.property].push(value);
                    return accumulator;
                }, {}),

            sitelinks: this.sitelinks
                .map((sitelink) => sitelink.toJSON())
                .reduce((accumulator, value) => ({...accumulator, [value.site]: value}), {})

        }) as any as WikidataItem;
    }
}
