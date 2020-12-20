import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
export default class Label {
    language: string;
    value: string;
    constructor(label: LabelAndDescription);
    toJSON(): LabelAndDescription;
}
//# sourceMappingURL=Label.d.ts.map