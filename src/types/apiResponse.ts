import {Item as WikibaseItem} from '@wmde/wikibase-datamodel-types';

export interface WbeditentityResponse {
    entity?: WikibaseItem;
    success?: number;
    error?: object;
    servedby? : string;
}
