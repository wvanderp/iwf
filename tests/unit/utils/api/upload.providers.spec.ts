import { inspect } from 'node:util';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { APIError, BearerTokenAuth, BotPasswordAuth, Item, OAuthAuth, upload } from '../../../../src';
import type { AuthProvider } from '../../../../src';

const accessToken = 'fake-access-token';
const userAgent = 'test-editor/1.0';
const csrf = { query: { tokens: { csrftoken: 'fake-csrf-token' } } };

describe('upload authentication providers', () => {
    let auth: BearerTokenAuth;
    let mock: MockAdapter;
    let publicMock: MockAdapter;

    beforeEach(() => {
        auth = new BearerTokenAuth({ accessToken, userAgent });
        mock = new MockAdapter(auth.getAxiosInstance());
        publicMock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
        publicMock.restore();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('preserves the bot password upload workflow through the shared interface', async () => {
        const bot: AuthProvider = new BotPasswordAuth({
            username: 'FakeUser@FakeBot', password: 'fake-password', userAgent
        });
        const botMock = new MockAdapter(bot.getAxiosInstance());
        botMock.onGet().replyOnce(200, { query: { tokens: { logintoken: 'fake-login-token' } } })
            .onGet().reply(200, csrf);
        botMock.onPost().replyOnce(200, { login: { result: 'Success' } })
            .onPost().reply(200, { success: 1, entity: Item.fromNothing().toJSON() });
        try {
            await expect(upload(Item.fromNothing(), { auth: bot, summary: 'Bot edit' })).resolves.toBeInstanceOf(Item);
            expect(botMock.history.post).toHaveLength(2);
            const body = new URLSearchParams(botMock.history.post[1].data as string);
            expect(body.get('token')).toBe('fake-csrf-token');
            expect(body.has('baserevid')).toBe(false);
            expect(body.has('assert')).toBe(false);
        } finally {
            botMock.restore();
        }
    });

    it('preserves browser OAuth callback authentication and subsequent uploads', async () => {
        const oauth = new OAuthAuth({
            clientId: 'fake-client', redirectUri: 'https://editor.example/callback', userAgent
        });
        const storage = new Map([
            ['iwf_oauth_state', 'fake-state'], ['iwf_oauth_verifier', 'fake-verifier']
        ]);
        vi.stubGlobal('window', globalThis);
        vi.stubGlobal('location', { href: 'https://editor.example/callback?code=fake-code&state=fake-state' });
        vi.stubGlobal('sessionStorage', {
            getItem: (key: string) => storage.get(key),
            removeItem: (key: string) => storage.delete(key)
        });
        publicMock.onPost('https://meta.wikimedia.org/w/rest.php/oauth2/access_token').reply(200, {
            access_token: accessToken, expires_in: 3600
        });
        await oauth.handleCallback();
        vi.unstubAllGlobals();
        publicMock.onGet().reply(200, csrf);
        publicMock.onPost().reply(200, { success: 1, entity: Item.fromNothing().toJSON() });
        await expect(upload(Item.fromNothing(), { auth: oauth, summary: 'OAuth edit' })).resolves.toBeInstanceOf(Item);
        const request = publicMock.history.post[1];
        expect(request.headers?.Authorization).toBe(`Bearer ${accessToken}`);
        expect(new URLSearchParams(request.data as string).get('token')).toBe('fake-csrf-token');
    });

    it('uses the complete bearer upload flow with the reviewed revision and assertion', async () => {
        const item = Item.fromNothing();
        item.id = 'Q42';
        item.lastrevid = 123;
        publicMock.onGet().reply(200, { entities: { Q42: item.toJSON() } });
        mock.onGet().reply(200, csrf);
        mock.onPost().reply(200, { success: 1, entity: item.toJSON() });
        await expect(upload(item, {
            auth, summary: 'Reviewed suggestions', baseRevisionId: 123, assert: 'user', maxLag: 5
        })).resolves.toBeInstanceOf(Item);
        const request = mock.history.post[0];
        const body = new URLSearchParams(request.data as string);
        expect(body.get('baserevid')).toBe('123');
        expect(body.get('assert')).toBe('user');
        expect(body.get('maxlag')).toBe('5');
        expect(body.get('token')).toBe('fake-csrf-token');
        expect(request.headers?.Authorization).toBe(`Bearer ${accessToken}`);
    });

    it('rejects an already stale reviewed revision before posting', async () => {
        const item = Item.fromNothing();
        item.id = 'Q42';
        item.lastrevid = 123;
        publicMock.onGet().reply(200, { entities: { Q42: { ...item.toJSON(), lastrevid: 124 } } });
        mock.onGet().reply(200, csrf);
        await expect(upload(item, { auth, summary: 'Stale edit', baseRevisionId: 123 }))
            .rejects.toMatchObject({ apiCode: 'editconflict' });
        expect(mock.history.post).toHaveLength(0);
    });

    it('propagates write-time conflicts without retrying or substituting the fetched revision', async () => {
        const item = Item.fromNothing();
        item.id = 'Q42';
        item.lastrevid = 123;
        publicMock.onGet().reply(200, { entities: { Q42: item.toJSON() } });
        mock.onGet().reply(200, csrf);
        mock.onPost().reply(200, { error: { code: 'editconflict', info: accessToken } });
        await expect(upload(item, { auth, summary: 'Conflict', baseRevisionId: 123, assert: 'user' }))
            .rejects.toMatchObject({ apiCode: 'editconflict' });
        expect(mock.history.post).toHaveLength(1);
        expect(new URLSearchParams(mock.history.post[0].data as string).get('baserevid')).toBe('123');
    });

    it('omits new options for existing upload calls and sanitizes API error fields', async () => {
        mock.onGet().reply(200, csrf);
        mock.onPost().replyOnce(200, { success: 1, entity: Item.fromNothing().toJSON() })
            .onPost().reply(200, { error: { code: accessToken, info: accessToken } });
        await upload(Item.fromNothing(), { auth, summary: 'New item' });
        const body = new URLSearchParams(mock.history.post[0].data as string);
        expect(body.has('baserevid')).toBe(false);
        expect(body.has('assert')).toBe(false);
        const error: unknown = await upload(Item.fromNothing(), { auth, summary: 'Failure' })
            .catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(APIError);
        expect(inspect(error, { depth: 10 })).not.toContain(accessToken);
    });
});
