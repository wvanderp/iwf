import axios, { AxiosInstance } from 'axios';

import { AuthProvider, BearerTokenConfig } from './types';
import { APIError, AuthExpiredError, NetworkError, NotLoggedInError, PermissionDeniedError, mapAPIError } from './errors';

interface TokenResponse {
    query?: { tokens?: { csrftoken?: string } };
    error?: { code?: string };
}

/**
 * Uses an already-issued OAuth 2.0 access token without browser APIs or refresh credentials.
 * Create a new provider when replacing a rejected or expired token. HTTP failures are
 * converted to credential-free errors; request configs and raw responses are never attached.
 */
export default class BearerTokenAuth implements AuthProvider {
    readonly #accessToken: string;

    private readonly userAgent: string;

    private readonly expiresAt?: number;

    private readonly axiosInstance: AxiosInstance;

    private readonly csrfTokenCache = new Map<string, string>();

    private rejected = false;

    /**
     * Creates a provider for an existing token.
     *
     * @param config Access token, User-Agent, and optional expiry in Unix epoch seconds
     * @example
     *   const auth = new BearerTokenAuth({ accessToken: 'issued-token', userAgent: 'MyEditor/1.0' });
     */
    constructor(config: BearerTokenConfig) {
        if (!config.accessToken.trim()) {
            throw new TypeError('A non-empty bearer access token is required.');
        }
        if (config.expiresAt !== undefined && !Number.isFinite(config.expiresAt)) {
            throw new TypeError('expiresAt must be a finite Unix timestamp in seconds.');
        }
        this.#accessToken = config.accessToken;
        this.userAgent = config.userAgent;
        this.expiresAt = config.expiresAt;
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: { 'User-Agent': config.userAgent }
        });
        this.axiosInstance.interceptors.request.use(async (requestConfig) => {
            requestConfig.headers.Authorization = `Bearer ${await this.getValidAccessToken()}`;
            return requestConfig;
        });
        this.axiosInstance.interceptors.response.use((response) => {
            const data = response.data as TokenResponse | undefined;
            if (data?.error) {
                // Preserve diagnostic codes, but never API text/details or echoed credentials.
                const code = typeof data.error.code === 'string' && !data.error.code.includes(this.#accessToken)
                    ? data.error.code : undefined;
                if (code === undefined) {
                    throw new APIError('Authenticated API request failed.');
                }
                if (code === 'mwoauth-invalid-authorization' || code === 'invalid_token') {
                    this.rejectToken();
                }
                if (code === 'badtoken') {
                    try {
                        const { origin } = new URL(this.axiosInstance.getUri(response.config));
                        this.csrfTokenCache.delete(origin);
                    } catch {
                        // A relative request without a base URL cannot identify the failed site.
                        this.csrfTokenCache.clear();
                    }
                }
                throw mapAPIError(code, 'Authenticated API request failed.');
            }
            return response;
        }, (error: unknown) => {
            if (error instanceof AuthExpiredError) {
                throw error;
            }
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    this.rejectToken();
                }
                if (error.response?.status === 403) {
                    throw new PermissionDeniedError('Bearer authentication was denied. Check token permissions.');
                }
            }
            // Axios errors retain Authorization headers in config/request and may echo tokens
            // in message/response/cause. Discard the entire original error, rather than redacting fields.
            throw new NetworkError('Authenticated HTTP request failed.');
        });
    }

    /**
     * Rejects the token permanently, including any cached CSRF tokens.
     * @private
     */
    private rejectToken(): never {
        this.rejected = true;
        this.csrfTokenCache.clear();
        throw new AuthExpiredError('Bearer access token was rejected. Supply a new access token.');
    }

    /**
     * Returns the supplied token unless it is within 60 seconds of expiry or has been rejected.
     *
     * @returns The bearer access token
     * @throws {AuthExpiredError} If a replacement token is required
     * @example
     *   const token = await auth.getValidAccessToken();
     */
    getValidAccessToken(): Promise<string> {
        if (this.rejected || (this.expiresAt !== undefined && Date.now() / 1000 >= this.expiresAt - 60)) {
            return Promise.reject(new AuthExpiredError(
                'Bearer access token is expired or rejected. Supply a new access token.'
            ));
        }
        return Promise.resolve(this.#accessToken);
    }

    /**
     * Retrieves and caches an authenticated CSRF token per site origin.
     *
     * @param site Wikibase site URL
     * @returns An authenticated CSRF token
     * @throws {NotLoggedInError} If the API returns a missing or anonymous token
     * @example
     *   const csrf = await auth.getCsrfToken('https://www.wikidata.org');
     */
    async getCsrfToken(site: string): Promise<string> {
        await this.getValidAccessToken();
        const { origin } = new URL(site);
        const cached = this.csrfTokenCache.get(origin);
        if (cached) return cached;

        const response = await this.axiosInstance.get<TokenResponse>(`${origin}/w/api.php`, {
            params: {
                action: 'query', meta: 'tokens', type: 'csrf', format: 'json', formatversion: '2', assert: 'user'
            }
        });
        const token = response.data?.query?.tokens?.csrftoken;
        if (!token || token === '+\\') {
            throw new NotLoggedInError('The API did not return an authenticated CSRF token.');
        }
        this.csrfTokenCache.set(origin, token);
        return token;
    }

    /**
     * Returns the authenticated client. Use only with trusted Wikimedia/Wikibase endpoints.
     *
     * @returns An axios client that validates expiry and injects the bearer header on each request
     * @example
     *   const client = auth.getAxiosInstance();
     */
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    /**
     * Returns the configured User-Agent.
     *
     * @returns The application User-Agent
     * @example
     *   const userAgent = auth.getUserAgent();
     */
    getUserAgent(): string {
        return this.userAgent;
    }
}
