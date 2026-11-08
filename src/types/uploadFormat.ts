import type { ItemJSON } from '../Item';

import {
    LabelLanguages, Statement
} from './wikidata';


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

export interface UploadFormat extends Omit<ItemJSON, 'labels' | 'descriptions' | 'aliases' | 'claims'> {
    labels: LabelsPlus;
    descriptions: DescriptionsPlus;
    aliases: AliasesPlus;
    claims: StatementMapPlus;
}
