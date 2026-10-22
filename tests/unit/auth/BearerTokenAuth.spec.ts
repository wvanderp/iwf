import { inspect } from 'node:util';
import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    APIError, AbuseFilterError, AuthExpiredError, BearerTokenAuth, BotPasswordAuth, CaptchaNeededError,
    NetworkError, NotLoggedInError, OAuthAuth, PermissionDeniedError, RateLimitedError, SpamBlocklistError
} from '../../../src';
import type { AuthProvider } from '../../../src';

const site = 'https://www.wikidata.org';
const accessToken = 'fake-access-token';
const userAgent = 'test-editor/1.0';
const csrf = { query: { tokens: { csrftoken: 'fake-csrf-token' } } };

describe('BearerTokenAuth', () => {
    let auth: BearerTokenAuth;
    let mock: MockAdapter;

    beforeEach(() => {
        auth = new BearerTokenAuth({ accessToken, userAgent });
        mock = new MockAdapter(auth.getAxiosInstance());
    });

    afterEach(() => {
        mock.restore();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it('exports a common interface compatible with all existing authentication providers', () => {
        expectTypeOf<BearerTokenAuth>().toExtend<AuthProvider>();
        expectTypeOf<BotPasswordAuth>().toExtend<AuthProvider>();
        expectTypeOf<OAuthAuth>().toExtend<AuthProvider>();
        expect(auth.getUserAgent()).toBe(userAgent);
    });

    it('injects the bearer header and User-Agent in Node and overrides a supplied Authorization header', async () => {
        mock.onGet('/test').reply(200, {});
        await auth.getAxiosInstance().get('/test', { headers: { Authorization: 'wrong' } });
        expect(mock.history.get[0].headers?.Authorization).toBe(`Bearer ${accessToken}`);
        expect(mock.history.get[0].headers?.['User-Agent']).toBe(userAgent);
        await expect(auth.getValidAccessToken()).resolves.toBe(accessToken);
    });

    it('retrieves authenticated CSRF tokens and caches them per origin', async () => {
        mock.onGet(`${site}/w/api.php`).reply(200, csrf);
        mock.onGet('https://test.wikidata.org/w/api.php').reply(200, csrf);
        await expect(auth.getCsrfToken(site)).resolves.toBe('fake-csrf-token');
        await expect(auth.getCsrfToken(`${site}/wiki/Q42`)).resolves.toBe('fake-csrf-token');
        await expect(auth.getCsrfToken('https://test.wikidata.org')).resolves.toBe('fake-csrf-token');
        expect(mock.history.get).toHaveLength(2);
        expect(mock.history.get[0]).toMatchObject({
            params: { action: 'query', meta: 'tokens', type: 'csrf', assert: 'user' },
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    });

    it.each([undefined, { query: { tokens: { csrftoken: '+\\' } } }, {}, { query: {} }, { query: { tokens: {} } },
        { query: { tokens: { csrftoken: '' } } }])('rejects missing or anonymous CSRF tokens: %j', async (data) => {
        mock.onGet().reply(200, data);
        await expect(auth.getCsrfToken(site)).rejects.toThrow(NotLoggedInError);
        mock.onGet().reply(200, csrf);
        await expect(auth.getCsrfToken(site)).resolves.toBe('fake-csrf-token');
    });

    it('rejects empty tokens and invalid expiry timestamps without exposing inputs', () => {
        expect(() => new BearerTokenAuth({ accessToken: '  ', userAgent })).toThrow(TypeError);
        expect(() => new BearerTokenAuth({ accessToken, userAgent, expiresAt: Number.NaN })).toThrow(TypeError);
    });

    it('validates expiry even for cached CSRF tokens and existing clients', async () => {
        vi.useFakeTimers();
        auth = new BearerTokenAuth({ accessToken, userAgent, expiresAt: Date.now() / 1000 + 61 });
        const client = auth.getAxiosInstance();
        const expiryMock = new MockAdapter(client);
        expiryMock.onGet().reply(200, csrf);
        try {
            await expect(auth.getCsrfToken(site)).resolves.toBe('fake-csrf-token');
            vi.advanceTimersByTime(1000);
            await expect(auth.getCsrfToken(site)).rejects.toThrow(AuthExpiredError);
            await expect(client.get('/test')).rejects.toThrow(AuthExpiredError);
            expect(expiryMock.history.get).toHaveLength(1);
        } finally {
            expiryMock.restore();
        }
    });

    it.each(['mwoauth-invalid-authorization', 'invalid_token'])(
        'invalidates cached credentials after API rejection %s', async (code) => {
            mock.onGet().replyOnce(200, csrf).onGet().reply(200, { error: { code, info: accessToken } });
            await auth.getCsrfToken(site);
            await expect(auth.getAxiosInstance().get('/test')).rejects.toThrow(AuthExpiredError);
            await expect(auth.getCsrfToken(site)).rejects.toThrow(AuthExpiredError);
            expect(mock.history.get).toHaveLength(2);
        }
    );

    it.each([
        { code: 'assertuserfailed', errorClass: NotLoggedInError },
        { code: 'notloggedin', errorClass: NotLoggedInError },
        { code: 'permissiondenied', errorClass: PermissionDeniedError },
        { code: 'ratelimited', errorClass: RateLimitedError },
        { code: 'maxlag', errorClass: RateLimitedError },
        { code: 'abusefilter-disallowed', errorClass: AbuseFilterError },
        { code: 'spamblacklist', errorClass: SpamBlocklistError },
        { code: 'captcha', errorClass: CaptchaNeededError },
        { code: 'editconflict', errorClass: APIError },
        { code: 'unknown-api-error', errorClass: APIError }
    ])('maps API $code to a safe typed error without rejecting the access token', async ({ code, errorClass }) => {
        mock.onGet().reply(200, { error: { code, info: accessToken, details: { secret: accessToken } } });
        const error: unknown = await auth.getAxiosInstance().get('/test').catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(errorClass);
        expect(error).toHaveProperty('details.apiCode', code);
        expect(inspect(error, { depth: 10 })).not.toContain(accessToken);
        expect(JSON.stringify(error)).not.toContain(accessToken);
        expect(error).not.toHaveProperty('cause');
        await expect(auth.getValidAccessToken()).resolves.toBe(accessToken);
    });

    it.each([undefined, 42, { secret: accessToken }, accessToken])(
        'discards malformed or credential-bearing API error codes: %j', async (code) => {
            mock.onGet().reply(200, { error: { code, info: accessToken } });
            const error: unknown = await auth.getAxiosInstance().get('/test').catch((error_: unknown) => error_);
            expect(error).toBeInstanceOf(APIError);
            expect((error as APIError).apiCode).toBeUndefined();
            expect(inspect(error, { depth: 10 })).not.toContain(accessToken);
        }
    );

    it('invalidates only the failed origin CSRF cache after badtoken without retrying the write', async () => {
        const otherSite = 'https://test.wikidata.org';
        mock.onGet().reply(200, csrf);
        await auth.getCsrfToken(site);
        await auth.getCsrfToken(otherSite);
        mock.onPost().reply(200, { error: { code: 'badtoken', info: accessToken } });
        await expect(auth.getAxiosInstance().post(`${site}/w/api.php`, 'token=old'))
            .rejects.toThrow(PermissionDeniedError);
        expect(mock.history.post).toHaveLength(1);
        await expect(auth.getCsrfToken(otherSite)).resolves.toBe('fake-csrf-token');
        expect(mock.history.get).toHaveLength(2);
        mock.resetHandlers();
        mock.onGet(`${site}/w/api.php`).reply(200, { query: { tokens: { csrftoken: 'replacement-csrf' } } });
        await expect(auth.getCsrfToken(site)).resolves.toBe('replacement-csrf');
        expect(mock.history.get).toHaveLength(3);
    });

    it('invalidates CSRF caches when a badtoken response has no resolvable origin', async () => {
        mock.onGet().reply(200, csrf);
        await auth.getCsrfToken(site);
        mock.onPost('/test').reply(200, { error: { code: 'badtoken' } });
        await expect(auth.getAxiosInstance().post('/test')).rejects.toThrow(PermissionDeniedError);
        await auth.getCsrfToken(site);
        expect(mock.history.get).toHaveLength(2);
        expect(mock.history.post).toHaveLength(1);
    });

    it.each([
        { status: 401, errorClass: AuthExpiredError },
        { status: 403, errorClass: PermissionDeniedError },
        { status: 500, errorClass: NetworkError }
    ])('discards credentials from HTTP $status errors and logs', async ({ status, errorClass }) => {
        const log = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        const errorLog = vi.spyOn(console, 'error').mockImplementation(vi.fn());
        const warn = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
        mock.onGet().reply(status, { error: { code: accessToken, info: accessToken } });
        const error: unknown = await auth.getCsrfToken(site).catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(errorClass);
        expect(inspect(error, { depth: 10 })).not.toContain(accessToken);
        expect(JSON.stringify(error)).not.toContain(accessToken);
        expect(error).not.toHaveProperty('cause');
        expect(log).not.toHaveBeenCalled();
        expect(errorLog).not.toHaveBeenCalled();
        expect(warn).not.toHaveBeenCalled();
    });

    it('requires a replacement token after HTTP 401', async () => {
        mock.onGet().reply(401);
        await expect(auth.getCsrfToken(site)).rejects.toThrow(AuthExpiredError);
        await expect(auth.getValidAccessToken()).rejects.toThrow(AuthExpiredError);
    });

    it('discards raw adapter errors, including messages, configs, and causes', async () => {
        mock.onGet().reply(() => {
            throw new AxiosError(accessToken, accessToken);
        });
        const error: unknown = await auth.getCsrfToken(site).catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(NetworkError);
        expect(inspect(error, { depth: 10 })).not.toContain(accessToken);
    });

    it('discards non-Axios failures that might contain credentials', async () => {
        mock.onGet().reply(() => {
            throw new Error(accessToken);
        });
        const error: unknown = await auth.getCsrfToken(site).catch((error_: unknown) => error_);
        expect(error).toBeInstanceOf(NetworkError);
        expect(inspect(error, { depth: 10 })).not.toContain(accessToken);
    });

    it('passes through empty successful responses from the authenticated HTTP client', async () => {
        mock.onGet().reply(200);
        await expect(auth.getAxiosInstance().get('/test')).resolves.toMatchObject({ status: 200 });
    });
});
