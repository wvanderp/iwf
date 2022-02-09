import {
    SiteLink as WikidataSiteLink
} from '@wmde/wikibase-datamodel-types';
import diffArray from 'diff-arrays-of-objects';

import { SiteLink } from '../..';
import { Change } from './Change';

export interface SiteLinkChange extends Change {
    type: 'siteLink',
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: WikidataSiteLink;
    new?: WikidataSiteLink;
}

/**
 * finds the added, removed, and changed aliases between two Arrays
 *
 * @param {SiteLink[]} o the old array
 * @param {SiteLink[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {SiteLinkChange[]} the changes from the old array to the new array
 * @example
 */
export default function siteLinkDiff(o: SiteLink[], n: SiteLink[], parentID: string): SiteLinkChange[] {
    const { added, updated, removed } = diffArray(
        o,
        n,
        'internalID',
        {
            compareFunction: (a: SiteLink, b: SiteLink) => (a.equals(b)),
            updatedValues: diffArray.updatedValues.both
        }
    );

    const deletedChanges = removed.map((c) => ({
        action: 'remove' as const,
        parentID,
        type: 'siteLink' as const,
        old: c.toJSON()
    }));

    const addedChanges = added.map((c) => ({
        action: 'add' as const,
        parentID,
        type: 'siteLink' as const,
        new: c.toJSON()
    }));

    const updatedChanges = updated.map((c) => ({
        action: 'update' as const,
        parentID,
        type: 'siteLink' as const,
        old: c[0].toJSON(),
        new: c[1].toJSON()
    }));

    return [...addedChanges, ...updatedChanges, ...deletedChanges];
}
