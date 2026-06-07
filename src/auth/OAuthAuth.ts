import axios, { AxiosInstance } from 'axios';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';
import { OAuthConfig } from './types';
import { AuthExpiredError, NotLoggedInError, PermissionDeniedError } from './errors';

const AUTH_BASE_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalWindow = globalThis as any;

/**
 * OAuth 2.0 scopes required for reading and writing to Wikibase
 * See: https://www.mediawiki.org/wiki/OAuth/For_Admins
 */
const OAUTH_SCOPES = [
    'basic',
    'createeditmovepage',
    'uploadfile',
    'uploadeditmovefile'
].join(' ');

interface TokenSet {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number; // Unix epoch seconds
}

interface CsrfTokenResponse {
    query: {
        tokens: {
            csrftoken: string;
        };
    };
}

/**
 * OAuth 2.0 authentication provider using Authorization Code flow with PKCE.
 *
 * Designed for use in browser environments where a redirect-based OAuth flow is possible.
 * Uses `sessionStorage` to temporarily hold PKCE state during the authorization redirect.
 *
 * The public interface (`getCsrfToken`, `getAxiosInstance`, `getUserAgent`) is compatible
 * with `BotPasswordAuth`, so the two can be used interchangeably in upload options.
 *
 * @example
 *   const auth = new OAuthAuth({
 *       clientId: 'my-oauth-client-id',
 *       redirectUri: 'https://my-app.example.com/callback',
 *       userAgent: 'MyApp/1.0'
 *   });
 *
 *   // Start the login flow (redirects the browser to Wikimedia)
 *   await auth.login();
 *
 *   // After Wikimedia redirects back to redirectUri, handle the callback:
 *   await auth.handleCallback();
 *
 *   // Now you can use the auth instance with upload()
 *   await upload(item, { auth, summary: 'OAuth upload' });
 */
export default class OAuthAuth {
    private readonly clientId: string;

    private readonly redirectUri: string;

    private readonly userAgent: string;

    private tokens: TokenSet | undefined;

    private csrfTokenCache: Map<string, string> = new Map();

    /**
     * Creates a new OAuthAuth instance
     *
     * @param {OAuthConfig} config OAuth 2.0 configuration
     * @example
     *   const auth = new OAuthAuth({
     *       clientId: 'my-client-id',
     *       redirectUri: 'https://my-app.example.com/auth/callback',
     *       userAgent: 'MyApp/1.0 (https://my-app.example.com)'
     *   });
     */
    constructor(config: OAuthConfig) {
        this.clientId = config.clientId;
        this.redirectUri = config.redirectUri;
        this.userAgent = config.userAgent;
    }

    /**
     * Initiates the OAuth 2.0 Authorization Code + PKCE flow.
     * Redirects the browser to the Wikimedia authorization endpoint.
     *
     * Must be called in a browser environment.
     *
     * @returns {Promise<void>} Resolves before the redirect (the page will navigate away)
     * @throws {Error} If called outside a browser environment
     * @example
     *   await auth.login();
     *   // browser navigates to Wikimedia login page
     */
    async login(): Promise<void> {
        // @ts-expect-error - We are checking if window exists and not using it if it doesn't.
        if (typeof window === 'undefined') {
            throw new TypeError('OAuthAuth.login() can only be called in a browser environment.');
        }

        const state = generateCodeVerifier(32);
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);

        globalWindow.sessionStorage.setItem('iwf_oauth_state', state);
        globalWindow.sessionStorage.setItem('iwf_oauth_verifier', verifier);

        const parameters = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: this.redirectUri,
            scope: OAUTH_SCOPES,
            state,
            code_challenge: challenge,
            code_challenge_method: 'S256'
        });

        globalWindow.location.href = `${AUTH_BASE_URL}/authorize?${parameters.toString()}`;
    }

    /**
     * Handles the OAuth 2.0 callback after Wikimedia redirects back.
     * Reads `?code` and `?state` from the current URL, validates state,
     * exchanges the authorization code for tokens, and stores them.
     *
     * Must be called on the page matching `redirectUri`.
     *
     * @returns {Promise<void>} Resolves when tokens have been stored
     * @throws {Error} If the OAuth state is invalid, the code is missing, or the token exchange fails
     * @example
     *   // On your callback page:
     *   await auth.handleCallback();
     *   window.location.href = '/';
     */
    async handleCallback(): Promise<void> {
        // @ts-expect-error - We are checking if window exists and not using it if it doesn't.
        if (typeof window === 'undefined') {
            throw new TypeError('OAuthAuth.handleCallback() can only be called in a browser environment.');
        }

        const url = new URL(globalWindow.location.href as string);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        const storedState = globalWindow.sessionStorage.getItem('iwf_oauth_state') as string | null;
        const verifier = globalWindow.sessionStorage.getItem('iwf_oauth_verifier') as string | null;

        if (error) {
            throw new PermissionDeniedError(
                `OAuth error: ${error} - ${errorDescription ?? 'unknown'}`,
                { details: error }
            );
        }

        if (!verifier || !storedState) {
            // Already processed or stale — if we already have tokens, continue silently
            if (this.tokens) {
                return;
            }

            throw new NotLoggedInError('OAuth callback state is missing. Please start the login flow again.');
        }

        if (!code || state !== storedState) {
            throw new NotLoggedInError('OAuth state mismatch or missing authorization code.');
        }

        // Clear session storage before the request to prevent replay on double-render
        globalWindow.sessionStorage.removeItem('iwf_oauth_state');
        globalWindow.sessionStorage.removeItem('iwf_oauth_verifier');

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.clientId,
            code,
            redirect_uri: this.redirectUri,
            code_verifier: verifier
        });

        const response = await axios.post<{
            access_token: string;
            refresh_token?: string;
            expires_in: number;
        }>(`${AUTH_BASE_URL}/access_token`, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = response.data;
        this.tokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in
        };

        // Clear CSRF cache since we have new credentials
        this.csrfTokenCache.clear();
    }

    /**
     * Returns a valid access token, refreshing it if it has expired.
     *
     * @returns {Promise<string>} The access token
     * @throws {NotLoggedInError} If no tokens are stored (user has not logged in)
     * @throws {AuthExpiredError} If the token has expired and cannot be refreshed
     * @example
     *   const token = await auth.getValidAccessToken();
     */
    async getValidAccessToken(): Promise<string> {
        if (!this.tokens) {
            throw new NotLoggedInError('Not authenticated. Call login() and handleCallback() first.');
        }

        const now = Math.floor(Date.now() / 1000);

        // Token is still valid (with 60-second buffer)
        if (now < this.tokens.expiresAt - 60) {
            return this.tokens.accessToken;
        }

        // Attempt to refresh
        if (this.tokens.refreshToken) {
            const body = new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: this.clientId,
                refresh_token: this.tokens.refreshToken
            });

            const response = await axios.post<{
                access_token: string;
                refresh_token?: string;
                expires_in: number;
            }>(`${AUTH_BASE_URL}/access_token`, body.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.status === 200) {
                const data = response.data;
                this.tokens = {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token ?? this.tokens.refreshToken,
                    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in
                };
                this.csrfTokenCache.clear();
                return this.tokens.accessToken;
            }
        }

        this.tokens = undefined;
        throw new AuthExpiredError('OAuth access token has expired and could not be refreshed. Please log in again.');
    }

    /**
     * Gets a CSRF token for the specified site using the OAuth Bearer token.
     *
     * For OAuth CORS requests the MediaWiki API requires both:
     * - `crossorigin=` query parameter
     * - `Authorization: Bearer <token>` header
     *
     * @param {string} site The site URL (e.g. `https://www.wikidata.org`)
     * @returns {Promise<string>} The CSRF token
     * @throws {NotLoggedInError} If the OAuth session is no longer valid
     * @example
     *   const csrfToken = await auth.getCsrfToken('https://www.wikidata.org');
     */
    async getCsrfToken(site: string): Promise<string> {
        const cached = this.csrfTokenCache.get(site);
        if (cached) {
            return cached;
        }

        const token = await this.getValidAccessToken();

        const siteURL = new URL(site);
        const apiURL = `${siteURL.origin}/w/api.php`;

        const parameters = new URLSearchParams({
            action: 'query',
            meta: 'tokens',
            type: 'csrf',
            format: 'json',
            formatversion: '2',
            crossorigin: ''
        });

        const response = await axios.get<CsrfTokenResponse>(
            `${apiURL}?${parameters.toString()}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const csrfToken = response.data?.query?.tokens?.csrftoken;

        if (!csrfToken || csrfToken === '+\\') {
            throw new NotLoggedInError(
                'Received anonymous CSRF token — OAuth authentication was not recognised by the API. Try logging in again.'
            );
        }

        this.csrfTokenCache.set(site, csrfToken);
        return csrfToken;
    }

    /**
     * Returns an axios instance pre-configured with the OAuth Bearer token.
     * Each request made through this instance will include an `Authorization: Bearer` header
     * populated with a freshly-validated access token.
     *
     * @returns {AxiosInstance} Configured axios instance
     * @example
     *   const ax = auth.getAxiosInstance();
     *   const response = await ax.get('https://www.wikidata.org/w/api.php?...');
     */
    getAxiosInstance(): AxiosInstance {
        const instance = axios.create();

        instance.interceptors.request.use(async (config) => {
            const token = await this.getValidAccessToken();
            config.headers = config.headers ?? {};
            config.headers['Authorization'] = `Bearer ${token}`;
            return config;
        });

        return instance;
    }

    /**
     * Logs out by clearing all stored tokens and cache.
     *
     * @example
     *   auth.logout();
     */
    logout(): void {
        this.tokens = undefined;
        this.csrfTokenCache.clear();
    }

    /**
     * Returns whether the user currently has valid (non-expired) tokens stored.
     *
     * @returns {boolean} `true` if authenticated
     * @example
     *   if (!auth.isAuthenticated) await auth.login();
     */
    get isAuthenticated(): boolean {
        if (!this.tokens) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        return now < this.tokens.expiresAt;
    }

    /**
     * Gets the user agent string
     *
     * @returns {string} The user agent
     * @example
     *   const userAgent = auth.getUserAgent();
     */
    getUserAgent(): string {
        return this.userAgent;
    }
}
