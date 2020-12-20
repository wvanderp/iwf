import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
export default class Alias {
    language: string;
    value: string;
    constructor(alias: LabelAndDescription);
    toJSON(): LabelAndDescription;
}
//# sourceMappingURL=Alias.d.ts.map