import { Item, Statement } from '@wmde/wikibase-datamodel-types';

/**
 * Change the type of Keys of T from NewType
 * https://dev.to/denniscual/typescript-hack-simple-utility-type-for-changing-type-of-keys-4bba
 */
export type ChangeTypeOfKeys<
    T extends object,
    Keys extends keyof T,
    NewType
> = {
    // Loop to every key. We gonna check if the key
    // is assignable to Keys. If yes, change the type.
    // Else, retain the type.
    [key in keyof T]: key extends Keys ? NewType : T[key]
};

export type StatementPlus = Statement | { id: string, remove?: '' };

export interface StatementMapPlus {
    [property: string]: StatementPlus[];
}
export type UploadFormat = ChangeTypeOfKeys<Item, 'claims', StatementMapPlus>;
