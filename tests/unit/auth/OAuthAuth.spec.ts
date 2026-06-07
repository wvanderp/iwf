import axios from 'axios';
import OAuthAuth from '../../../src/auth/OAuthAuth';
import { AuthExpiredError, NotLoggedInError, PermissionDeniedError } from '../../../src/auth/errors';

type BrowserSessionStorage = {
    setItem: (key: string, value: string) => void;
    getItem: (key: string) => string | null;
    removeItem: (key: string) => void;
    clear: () => void;
};

type OAuthAuthInternal = {
    tokens?: {
        accessToken: string;
        refreshToken?: string;
        expiresAt: number;
    };
    csrfTokenCache: Map<string, string>;
};

type AxiosInstanceWithHandlers = ReturnType<OAuthAuth['getAxiosInstance']> & {
    interceptors: {
        request: {
            handlers: Array<{
                fulfilled: (config: { headers?: Record<string, string> }) =>
                    Promise<{ headers: Record<string, string> }> | { headers: Record<string, string> };
            }>;
        };
    };
};

/**
 * Installs a minimal browser-like environment for OAuth redirect tests.
 *
 * @param [href] The location href to expose on the global object.
 * @returns The backing store and storage API.
 * @example
 *   const { sessionStorage } = installBrowser('https://app.example.test/callback?code=123');
 *   sessionStorage.setItem('iwf_oauth_state', 'state');
 */
function installBrowser(href = 'https://app.example.test/callback') {
    const store = new Map<string, string>();

    const sessionStorage: BrowserSessionStorage = {
        setItem: (key, value) => {
            store.set(key, value);
        },
        getItem: (key) => store.get(key) ?? null,
        removeItem: (key) => {
            store.delete(key);
        },
        clear: () => {
            store.clear();
        }
    };

    Object.assign(globalThis as Record<string, unknown>, {
        window: globalThis,
        location: { href },
        sessionStorage
    });

    return { store, sessionStorage };
}

describe('OAuthAuth', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        delete (globalThis as Record<string, unknown>).window;
        delete (globalThis as Record<string, unknown>).location;
        delete (globalThis as Record<string, unknown>).sessionStorage;
    });

    it('throws when login is called outside a browser environment', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await expect(auth.login()).rejects.toThrow(TypeError);
    });

    it('stores PKCE state and redirects to the authorize endpoint during login', async () => {
        const { store } = installBrowser('https://app.example.test/start');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await auth.login();

        expect(store.get('iwf_oauth_state')).toBeTruthy();
        expect(store.get('iwf_oauth_verifier')).toBeTruthy();
        const location = (globalThis as unknown as { location: { href: string } }).location;
        expect(location.href).toContain('/authorize?');
        expect(location.href).toContain('client_id=client-id');
    });

    it('throws when handleCallback is called outside a browser environment', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await expect(auth.handleCallback()).rejects.toThrow(TypeError);
    });

    it('throws a permission error when the callback contains an OAuth error', async () => {
        installBrowser('https://app.example.test/callback?error=access_denied&error_description=Denied');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await expect(auth.handleCallback()).rejects.toThrow(PermissionDeniedError);
    });

    it('uses an unknown fallback when the callback omits the error description', async () => {
        installBrowser('https://app.example.test/callback?error=access_denied');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await expect(auth.handleCallback()).rejects.toThrow('OAuth error: access_denied - unknown');
    });

    it('returns silently when callback state is missing but tokens already exist', async () => {
        installBrowser('https://app.example.test/callback');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'token',
            expiresAt: Math.floor(Date.now() / 1000) + 3600
        };

        await expect(auth.handleCallback()).resolves.toBeUndefined();
    });

    it('throws when callback state is missing and there are no tokens', async () => {
        installBrowser('https://app.example.test/callback');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await expect(auth.handleCallback()).rejects.toThrow(NotLoggedInError);
    });

    it('throws when the callback state does not match', async () => {
        const { sessionStorage } = installBrowser('https://app.example.test/callback?code=abc&state=wrong-state');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        sessionStorage.setItem('iwf_oauth_state', 'expected-state');
        sessionStorage.setItem('iwf_oauth_verifier', 'verifier');

        await expect(auth.handleCallback()).rejects.toThrow(NotLoggedInError);
    });

    it('exchanges the authorization code for tokens during callback handling', async () => {
        const { sessionStorage, store } = installBrowser('https://app.example.test/callback?code=abc123&state=expected-state');
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        sessionStorage.setItem('iwf_oauth_state', 'expected-state');
        sessionStorage.setItem('iwf_oauth_verifier', 'verifier');
        internal.csrfTokenCache.set('https://www.wikidata.org', 'cached-token');

        vi.spyOn(axios, 'post').mockResolvedValue({
            data: {
                access_token: 'new-access-token',
                refresh_token: 'new-refresh-token',
                expires_in: 3600
            }
        });

        await auth.handleCallback();

        expect(internal.tokens).toEqual({
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            expiresAt: expect.any(Number)
        });
        expect(store.has('iwf_oauth_state')).toBe(false);
        expect(store.has('iwf_oauth_verifier')).toBe(false);
        expect(internal.csrfTokenCache.size).toBe(0);
    });

    it('returns the current access token when it is still valid', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'current-token',
            expiresAt: Math.floor(Date.now() / 1000) + 3600
        };

        await expect(auth.getValidAccessToken()).resolves.toBe('current-token');
    });

    it('refreshes an expired access token when a refresh token is available', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'expired-token',
            refreshToken: 'refresh-token',
            expiresAt: Math.floor(Date.now() / 1000) - 1
        };
        internal.csrfTokenCache.set('https://www.wikidata.org', 'cached-token');

        vi.spyOn(axios, 'post').mockResolvedValue({
            status: 200,
            data: {
                access_token: 'refreshed-token',
                expires_in: 3600
            }
        });

        await expect(auth.getValidAccessToken()).resolves.toBe('refreshed-token');
        expect(internal.tokens?.refreshToken).toBe('refresh-token');
        expect(internal.csrfTokenCache.size).toBe(0);
    });

    it('throws when there is no stored token set', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });

        await expect(auth.getValidAccessToken()).rejects.toThrow(NotLoggedInError);
    });

    it('uses a new refresh token from the response when provided', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'expired-token',
            refreshToken: 'old-refresh-token',
            expiresAt: Math.floor(Date.now() / 1000) - 1
        };

        vi.spyOn(axios, 'post').mockResolvedValue({
            status: 200,
            data: {
                access_token: 'refreshed-token',
                refresh_token: 'new-refresh-token',
                expires_in: 3600
            }
        });

        await expect(auth.getValidAccessToken()).resolves.toBe('refreshed-token');
        expect(internal.tokens?.refreshToken).toBe('new-refresh-token');
    });

    it('throws when refresh response has a non-200 status', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'expired-token',
            refreshToken: 'refresh-token',
            expiresAt: Math.floor(Date.now() / 1000) - 1
        };

        vi.spyOn(axios, 'post').mockResolvedValue({
            status: 401,
            data: {}
        });

        await expect(auth.getValidAccessToken()).rejects.toThrow(AuthExpiredError);
        expect(internal.tokens).toBeUndefined();
    });

    it('throws when an expired token cannot be refreshed', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'expired-token',
            expiresAt: Math.floor(Date.now() / 1000) - 1
        };

        await expect(auth.getValidAccessToken()).rejects.toThrow(AuthExpiredError);
        expect(internal.tokens).toBeUndefined();
    });

    it('returns a cached CSRF token without making a request', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        const accessTokenSpy = vi.spyOn(auth, 'getValidAccessToken');
        internal.csrfTokenCache.set('https://www.wikidata.org', 'cached-csrf');

        await expect(auth.getCsrfToken('https://www.wikidata.org')).resolves.toBe('cached-csrf');
        expect(accessTokenSpy).not.toHaveBeenCalled();
    });

    it('fetches and caches a CSRF token for a site', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'current-token',
            expiresAt: Math.floor(Date.now() / 1000) + 3600
        };

        vi.spyOn(axios, 'get').mockResolvedValue({
            data: {
                query: {
                    tokens: {
                        csrftoken: 'csrf-token'
                    }
                }
            }
        });

        await expect(auth.getCsrfToken('https://www.wikidata.org')).resolves.toBe('csrf-token');
        expect(internal.csrfTokenCache.get('https://www.wikidata.org')).toBe('csrf-token');
    });

    it('throws when the API returns an anonymous CSRF token', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'current-token',
            expiresAt: Math.floor(Date.now() / 1000) + 3600
        };

        vi.spyOn(axios, 'get').mockResolvedValue({
            data: {
                query: {
                    tokens: {
                        csrftoken: '+\\'
                    }
                }
            }
        });

        await expect(auth.getCsrfToken('https://www.wikidata.org')).rejects.toThrow(NotLoggedInError);
    });

    it('adds a bearer token to requests created by getAxiosInstance', async () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        internal.tokens = {
            accessToken: 'current-token',
            expiresAt: Math.floor(Date.now() / 1000) + 3600
        };

        const instance = auth.getAxiosInstance() as unknown as AxiosInstanceWithHandlers;
        const requestHandler = instance.interceptors.request.handlers[0].fulfilled;
        const config = await requestHandler({});

        expect(config.headers.Authorization).toBe('Bearer current-token');
    });

    it('clears state on logout and reports authentication status', () => {
        const auth = new OAuthAuth({
            clientId: 'client-id',
            redirectUri: 'https://app.example.test/callback',
            userAgent: 'MyApp/1.0'
        });
        const internal = auth as unknown as OAuthAuthInternal;

        expect(auth.isAuthenticated).toBe(false);

        internal.tokens = {
            accessToken: 'current-token',
            expiresAt: Math.floor(Date.now() / 1000) + 3600
        };
        internal.csrfTokenCache.set('https://www.wikidata.org', 'cached-csrf');

        expect(auth.isAuthenticated).toBe(true);
        expect(auth.getUserAgent()).toBe('MyApp/1.0');

        auth.logout();

        expect(auth.isAuthenticated).toBe(false);
        expect(internal.csrfTokenCache.size).toBe(0);
    });
});
