/* eslint-disable unicorn/empty-brace-spaces */
import { parse } from 'qs';
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
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock requestItem
vi.mock('../../../../src/utils/api/request');
const mockRequestItem = vi.mocked(requestItem);

// Mock BotPasswordAuth for testing
const mockBotPasswordAuth = {
    getCsrfToken: vi.fn().mockResolvedValue('mock-csrf-token'),
    getAxiosInstance: vi.fn().mockReturnValue(vi.fn())
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

    let consoleErrorSpy: { mockRestore: () => void };

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.clearAllMocks();
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
            const data = parse(callArguments.data);
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
            const mockAxiosInstance = vi.fn().mockResolvedValue({
                data: {
                    entity: Item.fromNothing().toJSON(),
                    success: 1
                }
            });
            const getCsrfToken = vi.fn().mockResolvedValue('test-csrf-token');
            const getAxiosInstance = vi.fn().mockReturnValue(mockAxiosInstance);
            const getUserAgent = vi.fn().mockReturnValue('test-user-agent');

            const mockAuth = {
                getCsrfToken,
                getAxiosInstance,
                getUserAgent
            } as unknown as BotPasswordAuth;

            await upload(item, {
                summary: 'Upload summary',
                auth: mockAuth
            });

            expect(getCsrfToken).toHaveBeenCalledWith('https://www.wikidata.org');
            expect(getAxiosInstance).toHaveBeenCalled();
            expect(mockAxiosInstance).toHaveBeenCalledTimes(1);

            const callArguments = mockAxiosInstance.mock.calls[0][0] as unknown as { data: string };
            const data = parse(callArguments.data);
            expect(data.token).toEqual('test-csrf-token');
        });
    });
});

describe('generateUploadData', () => {
    const server = 'https://www.wikidata.org';

    beforeEach(() => {
        vi.clearAllMocks();
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

    it('should reuse existing claims array when property already has entries', async () => {
        const kept = Statement.fromSnak(WikibaseItemSnak.fromID('P111', 'Q10'));
        kept.id = 'S-kept';

        const removed = Statement.fromSnak(WikibaseItemSnak.fromID('P111', 'Q20'));
        removed.id = 'S-removed';

        const original = new Item({
            type: 'item',
            id: 'Q4',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: { P111: [kept.toJSON(), removed.toJSON()] },
            sitelinks: {}
        });

        const updated = new Item({
            type: 'item',
            id: 'Q4',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: { P111: [kept.toJSON()] },
            sitelinks: {}
        });

        mockRequestItem.mockResolvedValue(original);

        const data = await generateUploadData(updated, server) as unknown as UploadFormat;

        // The kept statement should be in the array along with the remove entry
        expect(data.claims.P111.length).toBeGreaterThanOrEqual(2);
        expect(data.claims.P111).toContainEqual({ remove: '', id: 'S-removed' });
    });

    it('should reuse existing aliases array when language already has entries', async () => {
        const original = Item.fromNothing();
        original.id = 'Q5';

        // Mock diff to return an alias removal for 'en' while the updated item
        // already has 'en' aliases, covering the false branch of the inner
        // "if (!json.aliases[language])" guard.
        vi.spyOn(original, 'diff').mockReturnValue([
            { type: 'alias', action: 'remove', parentID: 'Q5', old: { language: 'en', value: 'Alias2' } },
        ] as never);

        mockRequestItem.mockResolvedValue(original);

        const updated = new Item({
            type: 'item',
            id: 'Q5',
            labels: {},
            descriptions: {},
            aliases: { en: [{ language: 'en', value: 'Alias1' }] },
            claims: {},
            sitelinks: {}
        });

        const data = await generateUploadData(updated, server) as unknown as UploadFormat;

        expect(data.aliases.en).toBeDefined();
        expect(data.aliases.en).toContainEqual({ language: 'en', value: 'Alias2', remove: '' });
    });

    it('should skip removal entries when diff old data is incomplete', async () => {
        const original = Item.fromNothing();
        original.id = 'Q6';

        vi.spyOn(original, 'diff').mockReturnValue([
            { type: 'alias', action: 'remove', parentID: 'Q6', old: undefined },
            { type: 'label', action: 'remove', parentID: 'Q6', old: undefined },
            { type: 'description', action: 'remove', parentID: 'Q6', old: undefined },
            { type: 'siteLink', action: 'remove', parentID: 'Q6', old: undefined },
        ] as never);

        mockRequestItem.mockResolvedValue(original);

        const updated = new Item({
            type: 'item',
            id: 'Q6',
            labels: {},
            descriptions: {},
            aliases: {},
            claims: {},
            sitelinks: {}
        });

        const data = await generateUploadData(updated, server) as unknown as UploadFormat;

        // None of the removals should have been applied since old data was missing
        expect(Object.keys(data.aliases)).toHaveLength(0);
        expect(Object.keys(data.labels)).toHaveLength(0);
        expect(Object.keys(data.descriptions)).toHaveLength(0);
        expect(Object.keys(data.sitelinks)).toHaveLength(0);
    });
});
