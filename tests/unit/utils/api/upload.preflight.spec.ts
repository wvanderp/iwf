import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Item from '../../../../src/Item';
import BearerTokenAuth from '../../../../src/auth/BearerTokenAuth';
import upload, { generateUploadData } from '../../../../src/utils/api/upload';

describe('upload preflight', () => {
    const site = 'https://www.wikidata.org';
    const userAgent = 'ReviewedEditor/1.0 (editor@example.com)';
    let publicMock: MockAdapter;
    let auth: BearerTokenAuth;
    let authenticatedMock: MockAdapter;

    beforeEach(() => {
        publicMock = new MockAdapter(axios);
        auth = new BearerTokenAuth({ accessToken: 'fake-access-token', userAgent });
        authenticatedMock = new MockAdapter(auth.getAxiosInstance());
        authenticatedMock.onGet().reply(200, { query: { tokens: { csrftoken: 'fake-csrf-token' } } });
    });

    afterEach(() => {
        publicMock.restore();
        authenticatedMock.restore();
    });

    it.each([0, 123])('rejects revision %s for a new item before token acquisition or network requests', async (baseRevisionId) => {
        const getCsrfToken = vi.spyOn(auth, 'getCsrfToken');

        await expect(upload(Item.fromNothing(), { auth, summary: 'New item', baseRevisionId }))
            .rejects.toThrow(new TypeError('baseRevisionId can only be used with an existing item that has an ID.'));

        expect(getCsrfToken).not.toHaveBeenCalled();
        expect(publicMock.history).toHaveLength(0);
        expect(authenticatedMock.history).toHaveLength(0);
    });

    it('rejects a reviewed revision when generating a new item payload directly', async () => {
        await expect(generateUploadData(Item.fromNothing(), site, 123)).rejects.toThrow(TypeError);
        expect(publicMock.history).toHaveLength(0);
    });

    it('rejects a reviewed revision for an anonymous new item before any network request', async () => {
        await expect(upload(Item.fromNothing(), {
            anonymous: true, summary: 'New item', userAgent, baseRevisionId: 123
        })).rejects.toThrow(TypeError);
        expect(publicMock.history).toHaveLength(0);
    });

    it('uses the provider User-Agent during preflight while preserving the reviewed revision and removals', async () => {
        const item = Item.fromNothing();
        item.id = 'Q42';
        // Local metadata must not replace the caller's reviewed revision.
        item.lastrevid = 999;
        publicMock.onGet(`${site}/wiki/Special:EntityData/Q42.json`).reply(200, {
            entities: {
                Q42: {
                    ...item.toJSON(), lastrevid: 123, labels: { en: { language: 'en', value: 'Removed label' } }
                }
            }
        });
        authenticatedMock.onPost().reply(200, { success: 1, entity: item.toJSON() });

        await upload(item, { auth, summary: 'Reviewed edit', baseRevisionId: 123, userAgent: 'Ignored/1.0' });

        expect(publicMock.history.get).toHaveLength(1);
        expect(publicMock.history.get[0].headers?.['User-Agent']).toBe(userAgent);
        expect(publicMock.history.get[0].headers?.Authorization).toBeUndefined();
        expect(authenticatedMock.history.post).toHaveLength(1);
        const body = new URLSearchParams(authenticatedMock.history.post[0].data as string);
        expect(body.get('baserevid')).toBe('123');
        expect(JSON.parse(body.get('data') as string)).toMatchObject({
            labels: { en: { language: 'en', value: '' } }
        });
    });

    it('uses the anonymous User-Agent for both preflight and upload', async () => {
        const item = Item.fromNothing();
        item.id = 'Q42';
        publicMock.onGet().reply(200, { entities: { Q42: item.toJSON() } });
        publicMock.onPost().reply(200, { success: 1, entity: item.toJSON() });

        await upload(item, { anonymous: true, summary: 'Anonymous edit', userAgent });

        expect(publicMock.history.get[0].headers?.['User-Agent']).toBe(userAgent);
        expect(publicMock.history.post[0].headers?.['User-Agent']).toBe(userAgent);
        expect(new URLSearchParams(publicMock.history.post[0].data as string).has('baserevid')).toBe(false);
    });
});
