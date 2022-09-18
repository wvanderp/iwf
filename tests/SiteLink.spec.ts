import { describe, it } from 'mocha';
import { expect } from 'chai';
import { SiteLink } from '../src';

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
            const referenceObject = new SiteLink(siteLinkWithUrl);

            expect(referenceObject.url).to.deep.equal('https://zu.wikipedia.org/wiki/Umuntu');
        });

        it('without the url specified', () => {
            const referenceObject = new SiteLink(siteLinkWithOutUrl);

            expect(referenceObject.url).to.deep.equal('https://zu.wikipedia.org/wiki/Umuntu');
        });
    });

    describe('equals', () => {
        it('should be true if the sites are equal', () => {
            const siteLinkObject = new SiteLink(siteLinkWithOutUrl);

            expect(siteLinkObject.equals(siteLinkObject)).to.be.true;
        });

        it('should be true if the aliases are equal but not the same object', () => {
            const siteLinkObject = new SiteLink(siteLinkWithBadge);
            const siteLinkObject2 = new SiteLink(siteLinkWithBadge);

            expect(siteLinkObject.equals(siteLinkObject2)).to.be.true;
        });

        it('should be false if the sites are NOT equal', () => {
            const siteLinkObject = new SiteLink(siteLinkWithOutUrl);
            const siteLinkObject2 = new SiteLink(siteLinkWithOutUrl);

            siteLinkObject2.site = 'afwiki';

            expect(siteLinkObject.equals(siteLinkObject2)).to.be.false;
        });

        it('should be false if the titles are NOT equal', () => {
            const siteLinkObject = new SiteLink(siteLinkWithOutUrl);
            const siteLinkObject2 = new SiteLink(siteLinkWithOutUrl);

            siteLinkObject2.title = 'human';

            expect(siteLinkObject.equals(siteLinkObject2)).to.be.false;
        });

        it('should be false if the badges are NOT equal', () => {
            const siteLinkObject = new SiteLink(siteLinkWithOutUrl);
            const siteLinkObject2 = new SiteLink(siteLinkWithBadge);

            expect(siteLinkObject.equals(siteLinkObject2)).to.be.false;
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const siteLinkObject = new SiteLink(siteLinkWithUrl);

            expect(siteLinkObject.toJSON()).to.deep.equal(siteLinkWithUrl);
        });

        it('should have the right JSON stringification without the url', () => {
            const siteLinkObject = new SiteLink(siteLinkWithOutUrl);

            expect(siteLinkObject.toJSON()).to.deep.equal(siteLinkWithOutUrl);
        });
    });
});
