import { inspect } from 'node:util';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    AbuseFilterError, APIError, BearerTokenAuth, BotPasswordAuth, CaptchaNeededError,
    Item, NotLoggedInError, OAuthAuth, PermissionDeniedError, RateLimitedError,
    SpamBlocklistError, upload
} from '../../../../src';
import type { AuthProvider } from '../../../../src';

const site = 'https://www.wikidata.org';
const userAgent = 'upload-tests/1.0';
const secret = 'private-upload-credential';
const csrf = { query: { tokens: { csrftoken: secret } } };
const providers = ['bearer', 'bot password', 'OAuth', 'anonymous'] as const;
type Provider = typeof providers[number];

describe.each(providers)('%s upload errors', (provider) => {
    let publicMock: MockAdapter;
    const adapters: MockAdapter[] = [];

    beforeEach(() => {
        publicMock = new MockAdapter(axios);
        adapters.push(publicMock);
    });

    afterEach(() => {
        for (const adapter of adapters.splice(0)) {
            adapter.restore();
        }
        vi.unstubAllGlobals();
    });

    /**
     * Authenticate real providers while replacing only HTTP side effects.
     *
     * @param method The provider to authenticate
     * @returns The provider and its HTTP adapter
     * @example
     *   const { auth, mock } = await authenticate('bearer');
     */
    async function authenticate(method: Provider): Promise<{ auth?: AuthProvider; mock: MockAdapter }> {
        if (method === 'anonymous') {
            return { mock: publicMock };
        }
        if (method === 'bearer') {
            const auth = new BearerTokenAuth({ accessToken: secret, userAgent });
            const mock = new MockAdapter(auth.getAxiosInstance());
            adapters.push(mock);
            mock.onGet().reply(200, csrf);
            return { auth, mock };
        }
        if (method === 'bot password') {
            const auth = new BotPasswordAuth({ username: 'Test@Bot', password: secret, userAgent });
            const mock = new MockAdapter(auth.getAxiosInstance());
            adapters.push(mock);
            mock.onGet().replyOnce(200, { query: { tokens: { logintoken: 'login-token' } } })
                .onGet().reply(200, csrf);
            mock.onPost().replyOnce(200, { login: { result: 'Success' } });
            await auth.getCsrfToken(site);
            mock.resetHistory();
            return { auth, mock };
        }

        const auth = new OAuthAuth({ clientId: 'upload-test', redirectUri: 'https://editor.example/callback', userAgent });
        vi.stubGlobal('window', globalThis);
        vi.stubGlobal('location', { href: 'https://editor.example/callback?code=test-code&state=test-state' });
        const storage = new Map([['iwf_oauth_state', 'test-state'], ['iwf_oauth_verifier', 'test-verifier']]);
        vi.stubGlobal('sessionStorage', {
            getItem: (key: string) => storage.get(key),
            removeItem: (key: string) => storage.delete(key)
        });
        publicMock.onPost('https://meta.wikimedia.org/w/rest.php/oauth2/access_token').reply(200, {
            access_token: secret, expires_in: 3600
        });
        await auth.handleCallback();
        vi.unstubAllGlobals();
        publicMock.reset();
        publicMock.onGet().reply(200, csrf);
        return { auth, mock: publicMock };
    }

    it.each([
        ['notloggedin', NotLoggedInError],
        ['assertuserfailed', NotLoggedInError],
        ['permissiondenied', PermissionDeniedError],
        ['badtoken', PermissionDeniedError],
        ['maxlag', RateLimitedError],
        ['ratelimited', RateLimitedError],
        ['abusefilter-disallowed', AbuseFilterError],
        ['spamblacklist', SpamBlocklistError],
        ['captcha', CaptchaNeededError],
        ['editconflict', APIError],
        ['new-extension-error', APIError]
    ] as const)('maps %s without exposing response or request secrets', async (code, ErrorType) => {
        const { auth, mock } = await authenticate(provider);
        mock.onPost().reply(200, {
            error: { code, info: secret, details: { token: secret }, filter: secret, captcha: secret },
            request: { Authorization: secret }
        });
        const options = auth ? { auth, summary: secret } : { anonymous: true as const, userAgent, summary: secret };
        const error: unknown = await upload(Item.fromNothing(), options).catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(ErrorType);
        expect(error).toMatchObject({ details: { apiCode: code } });
        expect(inspect(error, { depth: 10 })).not.toContain(secret);
        expect(JSON.stringify(error)).not.toContain(secret);
        expect(mock.history.post).toHaveLength(1);
    });

    it.each([
        undefined, null, '', 'invalid response', [], {},
        { success: 0 }, { success: 1 }, { success: 1, entity: null },
        { success: 1, entity: [] }, { success: 1, entity: secret },
        { error: null }, { error: secret }, { error: { info: secret } },
        { error: { code: 42, info: secret } },
        { success: 1, entity: Item.fromNothing().toJSON(), error: { info: secret } }
    ])('safely rejects empty or malformed upload response %j', async (responseData) => {
        const { auth, mock } = await authenticate(provider);
        mock.onPost().reply(200, responseData);
        const options = auth ? { auth, summary: secret } : { anonymous: true as const, userAgent, summary: secret };
        const error: unknown = await upload(Item.fromNothing(), options).catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(APIError);
        expect(error).toMatchObject({ code: 'API_ERROR' });
        expect(inspect(error, { depth: 10 })).not.toContain(secret);
        expect(mock.history.post).toHaveLength(1);
    });
});
