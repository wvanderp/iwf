import qs from 'qs';
import upload, { generateURL, validateAuthentication } from '../../../../src/utils/api/upload';
import { Item } from '../../../../src';
import { Token } from '../../../../src/utils/api/token';

const token: Token = {
    token: 'token',
    cookie: 'cookie'
};

describe('generate url', () => {
    it('should generate a url', () => {
        const url = generateURL('https://wikidata.org', true);

        expect(url).toBe('https://wikidata.org/w/api.php?action=wbeditentity&format=json&new=item');
    });

    it('should generate a url with a custom domain', () => {
        const url = generateURL('https://test.wikidata.org', true);

        expect(url).toBe('https://test.wikidata.org/w/api.php?action=wbeditentity&format=json&new=item');
    });

    it('should generate a url without new', () => {
        const url = generateURL('https://wikidata.org', false);

        expect(url).toBe('https://wikidata.org/w/api.php?action=wbeditentity&format=json');
    });

    it('should generate a url with a origin', () => {
        const url = generateURL('https://wikidata.org', false, 'https://example.org');

        expect(url).toBe('https://wikidata.org/w/api.php?action=wbeditentity&format=json&origin=https%3A%2F%2Fexample.org');
    });

    it('should return the right url when a server is given', () => {
        expect(generateURL('https://www.wikidata.org', false)).toEqual('https://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL('https://wiki.openstreetmap.org', false)).toEqual('https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json');
        expect(generateURL('https://wiki.openstreetmap.org/wiki/Special:EntityData', false)).toEqual('https://wiki.openstreetmap.org/w/api.php?action=wbeditentity&format=json');

        expect(generateURL('http://www.wikidata.org/wiki/Q23', false)).toEqual('http://www.wikidata.org/w/api.php?action=wbeditentity&format=json');
    });

    it('should handle a load of rubbish', () => {
        // @ts-expect-error testing
        expect(() => generateURL(42, true)).toThrow();
        expect(() => generateURL('', true)).toThrow();
        expect(() => generateURL('dasdasdsad', true)).toThrow();
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

    describe('uploading', () => {
        it('should use the anonymous key if there is no key, but the anonymous key is set', async () => {
            const axiosMock = jest.fn();
            axiosMock.mockResolvedValue({
                data: {
                    entity: Item.fromNothing().toJSON(),
                    success: 1
                }
            });

            await upload(item, {
                summary: 'Upload summary',
                tags: [''],
                anonymous: true,

                // @ts-expect-error testing
                axiosInstance: axiosMock
            });

            expect(axiosMock).toHaveBeenCalledTimes(1);

            const arguments_ = axiosMock.mock?.calls[0][0];
            const data = qs.parse(arguments_?.data);
            expect(data.token).toEqual('+\\');
            expect(data.summary).toEqual('Upload summary');
            expect(data.tags).toEqual('');
        });

        it('throw when uploading does not succeeds', async () => {
            const axiosMock = jest.fn();
            axiosMock.mockResolvedValue({
                data: {
                    error: 'something went wrong'
                }
            });

            await expect(upload(item, {
                summary: 'Upload summary',
                tags: [''],
                anonymous: true,

                // @ts-expect-error testing
                axiosInstance: axiosMock
            })).rejects.toThrow();
        });
    });
});
