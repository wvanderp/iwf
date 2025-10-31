import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { AuthProvider, BotPasswordConfig, RequestConfig } from './types';
import { NotLoggedInError, PermissionDeniedError } from './errors';

interface LoginTokenResponse {
    query: {
        tokens: {
            logintoken: string;
        };
    };
}

interface LoginResponse {
    login: {
        result: string;
        reason?: string;
        lguserid?: number;
        lgusername?: string;
    };
}

interface CsrfTokenResponse {
    query: {
        tokens: {
            csrftoken: string;
        };
    };
}

/**
 * Bot Password authentication provider
 * Uses MediaWiki Action API login with bot passwords
 */
export default class BotPasswordAuth implements AuthProvider {
    private readonly username: string;

    private readonly password: string;

    private readonly userAgent: string;

    private readonly cookieJar: CookieJar;

    private readonly axiosInstance: AxiosInstance;

    private loggedInSites: Set<string> = new Set();

    private csrfTokenCache: Map<string, string> = new Map();

    constructor(config: BotPasswordConfig) {
        // Validate username format (should be MainAccount@BotName)
        if (!config.username.includes('@')) {
            throw new Error('Bot password username must be in format "MainAccount@BotName"');
        }

        this.username = config.username;
        this.password = config.password;
        this.userAgent = config.userAgent;
        this.cookieJar = new CookieJar();

        // Create axios instance with cookie jar support
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'User-Agent': this.userAgent
            }
        });

        wrapper(this.axiosInstance);
        (this.axiosInstance.defaults as { jar?: CookieJar }).jar = this.cookieJar;
    }

    /**
     * Ensures the user is logged in to the specified site
     *
     * @param site
     * @example
     */
    async ensureLoggedIn(site: string): Promise<void> {
        if (this.loggedInSites.has(site)) {
            return;
        }

        const siteURL = new URL(site);
        const apiURL = `${siteURL.origin}/w/api.php`;

        // Step 1: Get login token
        const loginTokenParameters = {
            action: 'query',
            meta: 'tokens',
            type: 'login',
            format: 'json'
        };

        const tokenResponse = await this.axiosInstance.get<LoginTokenResponse>(
            `${apiURL}?${qs.stringify(loginTokenParameters)}`
        );

        const loginToken = tokenResponse.data.query.tokens.logintoken;
        if (!loginToken) {
            throw new NotLoggedInError('Failed to obtain login token');
        }

        // Step 2: Perform login
        const loginParameters = {
            action: 'login',
            lgname: this.username,
            lgpassword: this.password,
            lgtoken: loginToken,
            format: 'json'
        };

        const loginResponse = await this.axiosInstance.post<LoginResponse>(
            apiURL,
            qs.stringify(loginParameters),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const loginResult = loginResponse.data.login.result;
        const failureReason = loginResponse.data.login.reason;
        if (loginResult !== 'Success') {
            const failureMessage = failureReason
                ? `Login failed: ${loginResult} - ${failureReason}`
                : `Login failed: ${loginResult}`;
            throw new PermissionDeniedError(
                failureMessage,
                { site, username: this.username }
            );
        }

        this.loggedInSites.add(site);
    }

    // eslint-disable-next-line class-methods-use-this
    async authorize(request: RequestConfig): Promise<RequestConfig> {
        // Cookie jar is automatically attached by axios-cookiejar-support
        // Just return the request as-is
        return request;
    }

    async getCsrfToken(site: string): Promise<string> {
        // Ensure we're logged in first
        await this.ensureLoggedIn(site);

        // Check cache
        const cached = this.csrfTokenCache.get(site);
        if (cached) {
            return cached;
        }

        // Fetch CSRF token
        const siteURL = new URL(site);
        const apiURL = `${siteURL.origin}/w/api.php`;

        const parameters = {
            action: 'query',
            meta: 'tokens',
            type: 'csrf',
            format: 'json'
        };

        const response = await this.axiosInstance.get<CsrfTokenResponse>(
            `${apiURL}?${qs.stringify(parameters)}`
        );

        const csrfToken = response.data.query.tokens.csrftoken;
        if (!csrfToken || csrfToken === '+\\') {
            throw new NotLoggedInError('Failed to obtain CSRF token - may not be logged in');
        }

        // Cache the token
        this.csrfTokenCache.set(site, csrfToken);
        return csrfToken;
    }

    async onAuthError(): Promise<void> {
        // Clear all cached state and force re-login
        this.loggedInSites.clear();
        this.csrfTokenCache.clear();
        // Cookie jar will be automatically refreshed on next login
    }

    /**
     * Gets the axios instance (for use in upload operations)
     *
     * @example
     */
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}
