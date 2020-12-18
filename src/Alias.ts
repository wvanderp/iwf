import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import normalizeOutput from './utils/normalizeOutput';

export default class Alias {
    language: string;

    value: string;

    constructor(alias: LabelAndDescription) {
        this.language = alias.language;
        this.value = alias.value;
    }

    toJSON(): LabelAndDescription {
        return normalizeOutput({
            language: this.language,
            value: this.value
        });
    }
}
