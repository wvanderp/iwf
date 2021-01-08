import { describe, it } from 'mocha';
import { expect } from 'chai';
import SiteLink from '../src/SiteLink';

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

describe('Reference', () => {
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
