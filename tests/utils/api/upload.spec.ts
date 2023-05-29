import {
    beforeEach, describe, it, before, after
} from 'mocha';
import axios from 'axios';
import chai from 'chai';
import chaiAsPromised = require('chai-as-promised');
import qs from 'qs';
import sinon, { SinonStub } from 'sinon';
import upload, { generateURL, validateAuthentication } from '../../../src/utils/api/upload';
import { Item } from '../../../src';
import { Token } from '../../../src/utils/api/token';

chai.use(chaiAsPromised);
const { expect } = chai;

const token: Token = {
    token: 'token',
    cookie: 'cookie'
};

describe('generateURL', () => {
    it('should return the right url when a server is given', () => {
        expect(generateURL('https://www.wikidata.org')).to.be.equal('https://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL('https://wiki.openstreetmap.org')).to.be.equal('https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL('https://wiki.openstreetmap.org/wiki/Special:EntityData')).to.be.equal('https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json');

        expect(generateURL('http://www.wikidata.org/wiki/Q23')).to.be.equal('http://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL()).to.be.equal('https://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
    });

    it('should handle a load of rubbish', () => {
        // @ts-expect-error testing
        expect(() => generateURL(42)).to.throw;
        expect(() => generateURL('')).to.throw;
        expect(() => generateURL('dasdasdsad')).to.throw;
    });
});

describe('validateAuthentication', () => {
    describe('unknown', () => {
        it('should throw if anonymous key not set but there is no other auth method', () => {
            expect(
                () => validateAuthentication({
                    summary: 'Upload summary',
                    tags: ['']
                })
            ).to.throw();
        });
    });

    describe('authToken', () => {
        it('should you provide a correct authToken it should return the correct authMethod ', () => {
            expect(
                validateAuthentication({
                    summary: 'Upload summary',
                    tags: [''],
                    authToken: token
                })
            ).to.equal('authToken');
        });
    });

    describe('anonymous', () => {
        it('should throw if a authToken is available but the anonymous key is set', () => {
            expect(
                () => validateAuthentication({
                    summary: 'Upload summary',
                    tags: [''],
                    authToken: token,
                    anonymous: true
                })
            ).to.throw();
        });
    });
});

describe('upload', () => {
    let axiosStub: SinonStub;
    const item = Item.fromNothing();

    before(() => {
        axiosStub = sinon.stub(axios, 'post').resolves(Promise.resolve({
            data: {
                entity: Item.fromNothing().toJSON(),
                success: 1
            }
        }));
    });

    beforeEach(() => {
        axiosStub.resetHistory();
    });

    after(() => {
        axiosStub.restore();
    });

    describe('uploading', () => {
        it('should use the anonymous key if there is no key, but the anonymous key is set', async () => {
            await upload(item, {
                summary: 'Upload summary',
                tags: [''],
                anonymous: true
            });

            expect(axiosStub.calledOnce).to.true;

            const arguments_ = axiosStub.getCall(0).args[1];

            const data = qs.parse(arguments_);
            expect(data.token).to.equal('+\\');
            expect(data.summary).to.equal('Upload summary');
            expect(data.tags).to.equal('');
        });

        it('throw when uploading does not succeeds', async () => {
            axiosStub.returns({
                data: {
                    error: 'something went wrong'
                }
            });

            expect(upload(item, {
                summary: 'Upload summary',
                tags: [''],
                anonymous: true
            })).to.eventually.throw();
        });
    });
});
