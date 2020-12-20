import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
export default class Description {
    language: string;
    value: string;
    constructor(label: LabelAndDescription);
    toJSON(): LabelAndDescription;
}
//# sourceMappingURL=Description.d.ts.map