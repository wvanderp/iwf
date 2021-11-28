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
        it('should be true if the items are equal', () => {
            const labelObject = new SiteLink(siteLinkWithOutUrl);

            expect(labelObject.equals(labelObject)).to.be.true;
        });

        it('should be false if the sites are NOT equal', () => {
            const labelObject = new SiteLink(siteLinkWithOutUrl);
            const labelObject2 = new SiteLink(siteLinkWithOutUrl);

            labelObject2.site = 'afwiki';

            expect(labelObject.equals(labelObject2)).to.be.false;
        });

        it('should be false if the titles are NOT equal', () => {
            const labelObject = new SiteLink(siteLinkWithOutUrl);
            const labelObject2 = new SiteLink(siteLinkWithOutUrl);

            labelObject2.title = 'human';

            expect(labelObject.equals(labelObject2)).to.be.false;
        });

        it('should be false if the badges are NOT equal', () => {
            const labelObject = new SiteLink(siteLinkWithOutUrl);
            const labelObject2 = new SiteLink(siteLinkWithBadge);

            expect(labelObject.equals(labelObject2)).to.be.false;
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const referenceObject = new SiteLink(siteLinkWithUrl);

            expect(referenceObject.toJSON()).to.deep.equal(siteLinkWithUrl);
        });

        it('should have the right JSON stringification without the url', () => {
            const referenceObject = new SiteLink(siteLinkWithOutUrl);

            expect(referenceObject.toJSON()).to.deep.equal(siteLinkWithOutUrl);
        });
    });
});
