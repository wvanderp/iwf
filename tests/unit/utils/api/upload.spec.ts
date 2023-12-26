import axios from 'axios';
import qs from 'qs';
import upload, { generateURL, validateAuthentication } from '../../../../src/utils/api/upload';
import { Item } from '../../../../src';
import { Token } from '../../../../src/utils/api/token';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const token: Token = {
    token: 'token',
    cookie: 'cookie'
};

describe('generateURL', () => {
    it('should return the right url when a server is given', () => {
        expect(generateURL('https://www.wikidata.org')).toEqual('https://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL('https://wiki.openstreetmap.org')).toEqual('https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL('https://wiki.openstreetmap.org/wiki/Special:EntityData')).toEqual('https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json');

        expect(generateURL('http://www.wikidata.org/wiki/Q23')).toEqual('http://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL()).toEqual('https://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
    });

    it('should handle a load of rubbish', () => {
        // @ts-expect-error testing
        expect(() => generateURL(42)).toThrow();
        expect(() => generateURL('')).toThrow();
        expect(() => generateURL('dasdasdsad')).toThrow();
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
            ).toThrow();
        });
    });

    describe('authToken', () => {
        it('should you provide a correct authToken it should return the correct authMethod', () => {
            expect(
                validateAuthentication({
                    summary: 'Upload summary',
                    tags: [''],
                    authToken: token
                })
            ).toEqual('authToken');
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
            ).toThrow();
        });
    });
});

describe('upload', () => {
    const item = Item.fromNothing();

    afterEach(() => {
        mockedAxios.get.mockReset();
        mockedAxios.post.mockReset();
    });

    describe('uploading', () => {
        it('should use the anonymous key if there is no key, but the anonymous key is set', async () => {
            mockedAxios.post.mockResolvedValue({
                data: {
                    entity: Item.fromNothing().toJSON(),
                    success: 1
                }
            });

            await upload(item, {
                summary: 'Upload summary',
                tags: [''],
                anonymous: true
            });

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);

            const arguments_ = mockedAxios.post?.mock?.calls[0][1] as string;

            const data = qs.parse(arguments_);
            expect(data.token).toEqual('+\\');
            expect(data.summary).toEqual('Upload summary');
            expect(data.tags).toEqual('');
        });

        it('throw when uploading does not succeeds', async () => {
            mockedAxios.post.mockResolvedValue({
                data: {
                    error: 'something went wrong'
                }
            });

            await expect(upload(item, {
                summary: 'Upload summary',
                tags: [''],
                anonymous: true
            })).rejects.toThrow();
        });
    });
});