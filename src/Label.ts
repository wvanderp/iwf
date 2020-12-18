import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

export default class Label {
    language: string;

    value: string;

    constructor(label: LabelAndDescription) {
        this.language = label.language;
        this.value = label.value;
    }

    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }
}
