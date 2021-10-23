import { expect } from 'chai';
import { describe, it } from 'mocha';
import { SiteLink } from '../../../src';
import { Changes } from '../../../src/utils/diff/Changes';
import siteLinkDiff from '../../../src/utils/diff/siteLinkDiff';

describe('siteLink diff', () => {
    it('should diff Sitelinks right', () => {
        const a: SiteLink[] = [
            new SiteLink({ site: 'kowiki', title: '지구', badges: [] }),
            new SiteLink({ site: 'dewiki', title: 'Erde', badges: [] }),
            new SiteLink({ site: 'nlwiki', title: 'Aarde', badges: ['Q17437796'] }),
            new SiteLink({ site: 'enwiki', title: 'Earth', badges: [] }),
            new SiteLink({ site: 'frwiki', title: 'Terre', badges: [] })
        ];

        const b: SiteLink[] = [
            new SiteLink({ site: 'kowiki', title: '지구', badges: [] }),
            new SiteLink({ site: 'nlwiki', title: 'Aarde', badges: [] }),
            new SiteLink({ site: 'enwiki', title: 'Earth', badges: ['Q17437796'] }),
            new SiteLink({ site: 'frwiki', title: 'Monde', badges: [] })
        ];

        b[0].internalID = a[0].internalID;
        b[1].internalID = a[2].internalID;
        b[2].internalID = a[3].internalID;
        b[3].internalID = a[4].internalID;

        const changes: Changes[] = [
            { action: 'update', parentID: 'Q2', type: 'siteLink', old: { site: 'nlwiki', title: 'Aarde', badges: ['Q17437796'] }, new: { site: 'nlwiki', title: 'Aarde', badges: [] } },
            { action: 'update', parentID: 'Q2', type: 'siteLink', old: { site: 'enwiki', title: 'Earth', badges: [] }, new: { site: 'enwiki', title: 'Earth', badges: ['Q17437796'] } },
            { action: 'update', parentID: 'Q2', type: 'siteLink', old: { site: 'frwiki', title: 'Terre', badges: [] }, new: { site: 'frwiki', title: 'Monde', badges: [] } },
            { action: 'remove', parentID: 'Q2', type: 'siteLink', old: { site: 'dewiki', title: 'Erde', badges: [] } }
        ];
        expect(siteLinkDiff(a, b, 'Q2')).to.deep.equal(changes);
    });
});
