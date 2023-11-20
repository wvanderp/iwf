import { SiteLink } from '../../src';

const siteLinkWithUrl = {
    site: 'zuwiki',
    title: 'Umuntu',
    badges: [],
    url: 'https://zu.wikipedia.org/wiki/Umuntu'
};

const siteLinkWithOutUrl = {
    site: 'zuwiki',
    title: 'Umuntu',
    badges: []
};

const siteLinkWithBadge = {
    site: 'zuwiki',
    title: 'Umuntu',
    badges: [
        'Q17437796'
    ]
};

describe('siteLink', () => {
    describe('get url', () => {
        it('with the url specified', () => {
            const siteLink = new SiteLink(siteLinkWithUrl);

            expect(siteLink.url).toStrictEqual('https://zu.wikipedia.org/wiki/Umuntu');
        });

        it('without the url specified', () => {
            const siteLink = new SiteLink(siteLinkWithOutUrl);

            expect(siteLink.url).toStrictEqual('https://zu.wikipedia.org/wiki/Umuntu');
        });
    });

    describe('equals', () => {
        it('should be true if the sites are equal', () => {
            const siteLink = new SiteLink(siteLinkWithOutUrl);

            expect(siteLink.equals(siteLink)).toBe(true);
        });

        it('should be true if the aliases are equal but not the same object', () => {
            const siteLink = new SiteLink(siteLinkWithBadge);
            const siteLink2 = new SiteLink(siteLinkWithBadge);

            expect(siteLink.equals(siteLink2)).toBe(true);
        });

        it('should be false if the sites are NOT equal', () => {
            const siteLink = new SiteLink(siteLinkWithOutUrl);
            const siteLink2 = new SiteLink(siteLinkWithOutUrl);

            siteLink2.site = 'afwiki';

            expect(siteLink.equals(siteLink2)).toBe(false);
        });

        it('should be false if the titles are NOT equal', () => {
            const siteLink = new SiteLink(siteLinkWithOutUrl);
            const siteLink2 = new SiteLink(siteLinkWithOutUrl);

            siteLink2.title = 'human';

            expect(siteLink.equals(siteLink2)).toBe(false);
        });

        it('should be false if the badges are NOT equal', () => {
            const siteLink = new SiteLink(siteLinkWithOutUrl);
            const siteLink2 = new SiteLink(siteLinkWithBadge);

            expect(siteLink.equals(siteLink2)).toBe(false);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const siteLink = new SiteLink(siteLinkWithUrl);

            expect(siteLink.toJSON()).toStrictEqual(siteLinkWithUrl);
        });

        it('should have the right JSON stringification without the url', () => {
            const siteLink = new SiteLink(siteLinkWithOutUrl);

            expect(siteLink.toJSON()).toStrictEqual(siteLinkWithOutUrl);
        });
    });
});
