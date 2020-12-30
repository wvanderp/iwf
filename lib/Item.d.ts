import { Item as WikidataItem } from '@wmde/wikibase-datamodel-types';
import Alias from './Alias';
import Claim from './Claim';
import Description from './Description';
import Label from './Label';
import SiteLink from './SiteLink';
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
    sitelinks: SiteLink[];
    constructor(item: WikidataItem);
    toJSON(): WikidataItem;
}
//# sourceMappingURL=Item.d.ts.map