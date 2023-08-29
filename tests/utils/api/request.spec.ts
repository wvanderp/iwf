import fs from 'fs';
import path from 'path';
import {
    describe, it, after, before
} from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import sinon, { SinonStub } from 'sinon';
import { baseURL } from '../../../src/utils/api/request';
import { requestItem } from '../../../src';

describe('baseURL functions', () => {
    it('should return the right url when a QID is given', () => {
        expect(baseURL('Q42')).to.be.equal('https://www.wikidata.org/wiki/Special:EntityData/Q42.json');
    });

    it('should return the right url when a QID and a server is given', () => {
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org')).to.be.equal('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
    });

    it('should return the right url when a QID and a server is given but the server is also a url', () => {
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Special:EntityData')).to.be.equal('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Special:EntityData/')).to.be.equal('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Tag:highway%3Dconstruction')).to.be.equal('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Tag:highway%3Dconstruction/')).to.be.equal('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');

        expect(baseURL('Q42', 'http://www.wikidata.org/wiki/Q23')).to.be.equal('http://www.wikidata.org/wiki/Special:EntityData/Q42.json');
    });

    it('should handle a load of rubbish', () => {
        // @ts-expect-error testing
        expect(() => baseURL()).to.throw;
        // @ts-expect-error testing
        expect(() => baseURL(42)).to.throw;
        expect(() => baseURL('')).to.throw;
        expect(() => baseURL('dasdasdsad')).to.throw;
        expect(() => baseURL('Q42', 'dasdasdsad')).to.throw;

        expect(() => baseURL('q42')).not.to.throw;
    });
});

describe('requestItem functions', () => {
    const contents = {
        data: {
            ...JSON.parse(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        `../../data/${fs.readdirSync(path.resolve(__dirname, '../../data/'))[0]
                        }`
                    )
                ).toString('utf8')
            ),
            success: 1
        }
    };
    const QID = Object.keys(contents.data.entities)[0];
    const wikidataJSON = contents.data.entities[QID];

    let axiosStub: SinonStub;

    before(() => {
        axiosStub = sinon.stub(axios, 'get').resolves(Promise.resolve(contents));
    });

    after(() => {
        axiosStub.restore();
    });

    it('should return the right data when a QID is given', async () => {
        const data = await requestItem(QID);
        expect(data.toJSON()).to.deep.equal(wikidataJSON);
        expect(axiosStub.calledOnce).to.be.true;
    });
});
