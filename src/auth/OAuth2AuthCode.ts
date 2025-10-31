import axios from 'axios';
import qs from 'qs';
import { AuthProvider, OAuth2Config, AccessToken, OAuth2TokenResponse, RequestConfig, PKCEParams } from './types';
import { FileTokenStore } from './tokenStore';
import { generateCodeVerifier, generateCodeChallenge } from './utils';
import { AuthExpiredError, NotLoggedInError } from './errors';

const DEFAULT_TOKEN_ENDPOINT = 'https://meta.wikimedia.org/w/rest.php/oauth2/access_token';
const DEFAULT_AUTHORIZE_ENDPOINT = 'https://meta.wikimedia.org/w/rest.php/oauth2/authorize';
const TOKEN_REFRESH_SKEW = 60000; // Refresh 60 seconds before expiry

/**
 * OAuth 2.0 Authorization Code with PKCE authentication provider
 * Supports both interactive authorization and headless refresh token flow
 */
export class OAuth2AuthCode implements AuthProvider {
    private readonly clientId: string;
    private readonly clientSecret?: string;
    private readonly tokenStore: FileTokenStore;
    private readonly scopes: string[];
    private readonly userAgent: string;
    private readonly tokenEndpoint: string;
    private readonly authorizeEndpoint: string;

    private accessToken?: AccessToken;
    private refreshToken?: string;
    private csrfTokenCache: Map<string, string> = new Map();

    constructor(config: OAuth2Config) {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.tokenStore = (config.tokenStore as FileTokenStore) ?? new FileTokenStore();
        this.scopes = config.scopes ?? ['editpage', 'createeditmovepage'];
        this.userAgent = config.userAgent;
        this.tokenEndpoint = config.tokenEndpoint ?? DEFAULT_TOKEN_ENDPOINT;
        this.authorizeEndpoint = config.authorizeEndpoint ?? DEFAULT_AUTHORIZE_ENDPOINT;
    }

    /**
     * Begins the interactive OAuth authorization flow
     * @param callbackUrl The URL to redirect to after authorization
     * @returns Authorization URL and PKCE verifier to use in completeInteractiveAuth
     */
    beginInteractiveAuth(callbackUrl: string): { authorizeUrl: string; pkceParams: PKCEParams } {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);

        const params = {
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: callbackUrl,
            scope: this.scopes.join(' '),
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        };

        const authorizeUrl = `${this.authorizeEndpoint}?${qs.stringify(params)}`;

        return {
            authorizeUrl,
            pkceParams: {
                codeVerifier,
                codeChallenge,
                codeChallengeMethod: 'S256'
            }
        };
    }

    /**
     * Completes the interactive OAuth authorization flow
     * @param code The authorization code received from the callback
     * @param codeVerifier The PKCE code verifier from beginInteractiveAuth
     * @param callbackUrl The callback URL (must match the one used in beginInteractiveAuth)
     */
    async completeInteractiveAuth(code: string, codeVerifier: string, callbackUrl: string): Promise<void> {
        const params: Record<string, string> = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackUrl,
            client_id: this.clientId,
            code_verifier: codeVerifier
        };

        if (this.clientSecret) {
            params.client_secret = this.clientSecret;
        }

        const response = await axios.post<OAuth2TokenResponse>(
            this.tokenEndpoint,
            qs.stringify(params),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': this.userAgent
                }
            }
        );

        const tokenData = response.data;

        // Store access token
        this.accessToken = {
            token: tokenData.access_token,
            expiresAt: Date.now() + (tokenData.expires_in * 1000)
        };

        // Store refresh token
        if (tokenData.refresh_token) {
            this.refreshToken = tokenData.refresh_token;
            await this.tokenStore.saveRefreshToken(tokenData.refresh_token);
        }
    }

    /**
     * Initializes from stored refresh token (for headless CI usage)
     */
    async initializeFromRefreshToken(): Promise<void> {
        const storedToken = await this.tokenStore.loadRefreshToken();
        if (!storedToken) {
            throw new NotLoggedInError('No stored refresh token found');
        }

        this.refreshToken = storedToken;
        await this.refreshAccessToken();
    }

    /**
     * Refreshes the access token using the refresh token
     */
    private async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new AuthExpiredError('No refresh token available');
        }

        const params: Record<string, string> = {
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            client_id: this.clientId
        };

        if (this.clientSecret) {
            params.client_secret = this.clientSecret;
        }

        try {
            const response = await axios.post<OAuth2TokenResponse>(
                this.tokenEndpoint,
                qs.stringify(params),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': this.userAgent
                    }
                }
            );

            const tokenData = response.data;

            this.accessToken = {
                token: tokenData.access_token,
                expiresAt: Date.now() + (tokenData.expires_in * 1000)
            };

            // Update refresh token if a new one was provided
            if (tokenData.refresh_token) {
                this.refreshToken = tokenData.refresh_token;
                await this.tokenStore.saveRefreshToken(tokenData.refresh_token);
            }
        } catch (error) {
            throw new AuthExpiredError('Failed to refresh access token', { originalError: (error as Error).message });
        }
    }

    /**
     * Ensures we have a valid access token, refreshing if necessary
     */
    private async ensureValidAccessToken(): Promise<string> {
        // If no access token, try to refresh
        if (!this.accessToken) {
            await this.refreshAccessToken();
        }

        // Check if token is expired or expiring soon
        if (this.accessToken && this.accessToken.expiresAt - Date.now() < TOKEN_REFRESH_SKEW) {
            await this.refreshAccessToken();
        }

        if (!this.accessToken) {
            throw new AuthExpiredError('Unable to obtain valid access token');
        }

        return this.accessToken.token;
    }

    async authorize(request: RequestConfig): Promise<RequestConfig> {
        const token = await this.ensureValidAccessToken();

        return {
            ...request,
            headers: {
                ...request.headers,
                Authorization: `Bearer ${token}`
            }
        };
    }

    async getCsrfToken(site: string): Promise<string> {
        // Check cache first
        const cached = this.csrfTokenCache.get(site);
        if (cached) {
            return cached;
        }

        // Fetch new token
        const token = await this.ensureValidAccessToken();
        const siteURL = new URL(site);
        const apiURL = `${siteURL.origin}/w/api.php`;

        const params = {
            action: 'query',
            meta: 'tokens',
            type: 'csrf',
            format: 'json'
        };

        const response = await axios.get(
            `${apiURL}?${qs.stringify(params)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'User-Agent': this.userAgent
                }
            }
        );

        const csrfToken = response.data?.query?.tokens?.csrftoken as string;
        if (!csrfToken || csrfToken === '+\\') {
            throw new NotLoggedInError('Failed to obtain CSRF token');
        }

        // Cache the token
        this.csrfTokenCache.set(site, csrfToken);
        return csrfToken;
    }

    async onAuthError(error: Error): Promise<void> {
        // Clear cached CSRF tokens
        this.csrfTokenCache.clear();

        // Try to refresh the access token
        if (error instanceof AuthExpiredError || (error as { response?: { status: number } }).response?.status === 401) {
            await this.refreshAccessToken();
        }
    }
}
