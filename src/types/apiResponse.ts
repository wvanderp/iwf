import type { z } from 'zod';

import type { WbeditentityResponseSchema } from '../schemas/wikidata';

export type WbeditentityResponse = Partial<z.infer<typeof WbeditentityResponseSchema>> & {
    error?: {
        code?: string,
        info?: string
    };
};

export interface ActionLoginResponse {
    warnings: {
        main: {
            '*': string
        },
        login?: {
            '*': string
        }
    },
    login: {
        result: 'Aborted',
        reason?: string, // Only if the result is not successful (maybe)
        token?: string
    }
}

export interface QueryMetaTokenResponse {
    batchcomplete: string,
    query: {
        tokens: { csrftoken: string }
    }
}
