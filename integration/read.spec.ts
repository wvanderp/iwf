import { expect } from 'chai';
import { describe, it } from 'mocha';
import { requestItem } from '../src';

describe('reading from wikidata', () => {
    it('should retrieve a item when requested', async () => {
        const item = await requestItem('Q42');

        expect(item).to.be.an('object');

        expect(item).to.have.property('id');
        expect(item).to.have.property('labels');
        expect(item).to.have.property('descriptions');
        expect(item).to.have.property('aliases');
        expect(item).to.have.property('statements');
        expect(item).to.have.property('sitelinks');

        expect(item.id).to.equal('Q42');
        expect(item.labels).to.be.an('array');
        expect(item.descriptions).to.be.an('array');
        expect(item.aliases).to.be.an('array');
        expect(item.statements).to.be.an('array');
        expect(item.sitelinks).to.be.an('array');

        expect(item.ns).to.equal(0);
        expect(item.title).to.equal('Q42');

        expect(item.labels.find((label) => label.value === 'Douglas Adams')).to.be.an('object');
    });
});
