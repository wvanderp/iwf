import { Item as WikibaseItem } from '@wmde/wikibase-datamodel-types';

export interface WbeditentityResponse {
    entity?: WikibaseItem;
    success?: number;
    error?: {
        code?: string,
        info?: string
    };
    servedby? : string;
}

export interface ActionLoginResponse{
    warnings: {
        main: {
            '*': string
        },
        login: {
            '*': string
        }
    },
    login: {
        result: string,
        token: string
    }
}

export interface QueryMetaTokenResponse{
    batchcomplete: string,
    query: {
        tokens: { csrftoken: string }
    }
}
