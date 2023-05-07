import {
    LabelLanguages, Sitelinks, Statement
} from '@wmde/wikibase-datamodel-types';

export type StatementPlus = Statement | { id: string, remove?: '' };

export interface StatementMapPlus {
    [property: string]: StatementPlus[];
}

export interface LabelsPlus {
    [language: string]: LabelAndDescriptionPlus;
}

export interface DescriptionsPlus {
    [language: string]: LabelAndDescriptionPlus;
}

export interface AliasesPlus {
    [language: string]: LabelAndDescriptionPlus[];
}

export interface LabelAndDescriptionPlus {
    language: LabelLanguages;
    value: string;
    remove?: '';
}

export interface UploadFormat {
    pageid?: number;
    ns?: number;
    title?: string;

    lastrevid?: number;
    modified?: string; // ISO 8601 date string

    type: 'item';
    id: string; // Q-string

    labels: LabelsPlus;
    descriptions: DescriptionsPlus;
    aliases: AliasesPlus;
    claims: StatementMapPlus;
    sitelinks: Sitelinks;
}
