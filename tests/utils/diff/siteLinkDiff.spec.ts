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
            new SiteLink({ site: 'frwiki', title: 'Monde', badges: [] }),
            new SiteLink({ site: 'itwiki', title: 'Mondo', badges: [] })
        ];

        const changes: Changes[] = [
            {
                action: 'add', parentID: 'Q2', type: 'siteLink', new: { site: 'frwiki', title: 'Monde', badges: [] }
            },
            {
                action: 'add', parentID: 'Q2', type: 'siteLink', new: { site: 'itwiki', title: 'Mondo', badges: [] }
            },
            {
                action: 'update', parentID: 'Q2', type: 'siteLink', old: { site: 'nlwiki', title: 'Aarde', badges: ['Q17437796'] }, new: { site: 'nlwiki', title: 'Aarde', badges: [] }
            },
            {
                action: 'update', parentID: 'Q2', type: 'siteLink', old: { site: 'enwiki', title: 'Earth', badges: [] }, new: { site: 'enwiki', title: 'Earth', badges: ['Q17437796'] }
            },
            {
                action: 'remove', parentID: 'Q2', type: 'siteLink', old: { site: 'dewiki', title: 'Erde', badges: [] }
            },
            {
                action: 'remove', parentID: 'Q2', type: 'siteLink', old: { site: 'frwiki', title: 'Terre', badges: [] }
            }
        ];
        expect(siteLinkDiff(a, b, 'Q2')).to.deep.equal(changes);
    });

    it('should find diffs when there aren\'t any', () => {
        const a: SiteLink[] = [
            new SiteLink({ site: 'kowiki', title: '지구', badges: [] }),
            new SiteLink({ site: 'dewiki', title: 'Erde', badges: [] }),
            new SiteLink({ site: 'nlwiki', title: 'Aarde', badges: ['Q17437796'] }),
            new SiteLink({ site: 'enwiki', title: 'Earth', badges: [] }),
            new SiteLink({ site: 'frwiki', title: 'Terre', badges: [] })
        ];

        const b: SiteLink[] = [
            new SiteLink({ site: 'kowiki', title: '지구', badges: [] }),
            new SiteLink({ site: 'dewiki', title: 'Erde', badges: [] }),
            new SiteLink({ site: 'nlwiki', title: 'Aarde', badges: ['Q17437796'] }),
            new SiteLink({ site: 'enwiki', title: 'Earth', badges: [] }),
            new SiteLink({ site: 'frwiki', title: 'Terre', badges: [] })
        ];

        expect(siteLinkDiff(a, b, 'Q2')).to.deep.equal([]);
    });
});
