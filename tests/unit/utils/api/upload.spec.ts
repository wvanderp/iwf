/* eslint-disable unicorn/empty-brace-spaces */
import qs from 'qs';
import axios from 'axios';
import upload, { generateURL, validateAuthentication, generateUploadData } from '../../../../src/utils/api/upload';
import {
    BotPasswordAuth,
    Item,
    Statement,
    WikibaseItemSnak
} from '../../../../src';
import { UploadFormat } from '../../../../src/types/uploadFormat';
import requestItem from '../../../../src/utils/api/request';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

// Mock requestItem
jest.mock('../../../../src/utils/api/request');
const mockRequestItem = requestItem as jest.MockedFunction<typeof requestItem>;

// Mock BotPasswordAuth for testing
const mockBotPasswordAuth = {
    getCsrfToken: jest.fn().mockResolvedValue('mock-csrf-token'),
    getAxiosInstance: jest.fn().mockReturnValue(jest.fn())
} as unknown as BotPasswordAuth;

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

    describe('auth (BotPasswordAuth)', () => {
        it('should return auth when BotPasswordAuth is provided', () => {
            expect(
                validateAuthentication({
                    summary: 'Upload summary',
                    tags: [''],
                    auth: mockBotPasswordAuth
                })
            ).toEqual('auth');
        });
    });

    describe('anonymous', () => {
        it('should return anonymous when anonymous flag is set', () => {
            expect(
                validateAuthentication({
                    summary: 'Upload summary',
                    tags: [''],
                    anonymous: true
                })
            ).toEqual('anonymous');
        });

        it('should throw if auth is available but the anonymous key is set', () => {
            expect(
                () => validateAuthentication({
                    summary: 'Upload summary',
                    tags: [''],
                    auth: mockBotPasswordAuth,
                    anonymous: true
                })
            ).toThrow();
        });
    });
});

describe('upload', () => {
    const item = Item.fromNothing();

    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('uploading', () => {
        it('should use the anonymous token when anonymous flag is set', async () => {
            mockedAxios.mockResolvedValue({
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

            expect(mockedAxios).toHaveBeenCalledTimes(1);

            const callArguments = mockedAxios.mock.calls[0][0] as unknown as { data: string };
            const data = qs.parse(callArguments.data);
            expect(data.token).toEqual('+\\');
            expect(data.summary).toEqual('Upload summary');
            expect(data.tags).toEqual('');
        });

        it('should throw when uploading does not succeed', async () => {
            mockedAxios.mockResolvedValue({
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

        it('should use BotPasswordAuth when auth is provided', async () => {
            const mockAxiosInstance = jest.fn().mockResolvedValue({
                data: {
                    entity: Item.fromNothing().toJSON(),
                    success: 1
                }
            });

            const mockAuth = {
                getCsrfToken: jest.fn().mockResolvedValue('test-csrf-token'),
                getAxiosInstance: jest.fn().mockReturnValue(mockAxiosInstance),
                getUserAgent: jest.fn().mockReturnValue('test-user-agent')
            } as unknown as BotPasswordAuth;

            await upload(item, {
                summary: 'Upload summary',
                auth: mockAuth
            });

            expect(mockAuth.getCsrfToken).toHaveBeenCalledWith('https://www.wikidata.org');
            expect(mockAuth.getAxiosInstance).toHaveBeenCalled();
            expect(mockAxiosInstance).toHaveBeenCalledTimes(1);

            const callArguments = mockAxiosInstance.mock.calls[0][0] as unknown as { data: string };
            const data = qs.parse(callArguments.data);
            expect(data.token).toEqual('test-csrf-token');
        });
    });
});

describe('generateUploadData', () => {
    const server = 'https://www.wikidata.org';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a remove entry for removed statements that have an id', async () => {
        const statement = Statement.fromSnak(WikibaseItemSnak.fromID('P111', 'Q2'));
        statement.id = 'S1';

        const original = new Item({
            type: 'item',
            id: 'Q1',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: { P111: [statement.toJSON()] },
            sitelinks: {}
        });

        const updated = new Item({
            type: 'item',
            id: 'Q1',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: {},
            sitelinks: {}
        });

        mockRequestItem.mockResolvedValue(original);

        const data = await generateUploadData(updated, server) as unknown as UploadFormat;

        expect(data.claims.P111).toBeDefined();
        expect(data.claims.P111[0]).toEqual({ remove: '', id: 'S1' });
    });

    it('should not add a remove entry for removed statements without an id', async () => {
        const statement = Statement.fromSnak(WikibaseItemSnak.fromID('P222', 'Q2'));
        // no id set

        const original = new Item({
            type: 'item',
            id: 'Q2',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: { P222: [statement.toJSON()] },
            sitelinks: {}
        });

        const updated = new Item({
            type: 'item',
            id: 'Q2',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: {},
            sitelinks: {}
        });

        mockRequestItem.mockResolvedValue(original);

        const data = await generateUploadData(updated, server) as unknown as UploadFormat;

        expect(data.claims.P222).toBeUndefined();
    });

    it('should add remove entries for labels, descriptions, aliases and sitelinks', async () => {
        const original = new Item({
            type: 'item',
            id: 'Q3',
            labels: { en: { language: 'en', value: 'OldLabel' } },
            descriptions: { en: { language: 'en', value: 'OldDescription' } },
            aliases: { en: [{ language: 'en', value: 'OldAlias' }] },
            claims: {},
            sitelinks: { enwiki: { site: 'enwiki', title: 'OldTitle' } }
        });

        const updated = new Item({
            type: 'item',
            id: 'Q3',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: {},
            sitelinks: {}
        });

        mockRequestItem.mockResolvedValue(original);

        const data = await generateUploadData(updated, server) as unknown as UploadFormat;

        // Labels and descriptions should be set to an empty value
        expect(data.labels.en).toEqual({ language: 'en', value: '' });
        expect(data.descriptions.en).toEqual({ language: 'en', value: '' });

        // Aliases should include a remove entry
        expect(data.aliases.en).toBeDefined();
        expect(data.aliases.en[0]).toEqual({ language: 'en', value: 'OldAlias', remove: '' });

        // Sitelinks should be set to an empty title
        expect(data.sitelinks.enwiki).toEqual({ site: 'enwiki', title: '' });
    });
});
