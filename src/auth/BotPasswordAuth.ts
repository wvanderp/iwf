import axios, { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import { BotPasswordConfig } from './types';
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
export default class BotPasswordAuth {
    private readonly username: string;

    private readonly password: string;

    private readonly userAgent: string;

    private readonly axiosInstance: AxiosInstance;

    private loggedInSites: Set<string> = new Set();

    private csrfTokenCache: Map<string, string> = new Map();

    private cookies: Map<string, string[]> = new Map();

    /**
     * Creates a new BotPasswordAuth instance
     *
     * @param {BotPasswordConfig} config Bot password configuration
     *
     * @example
     *   const botAuth = new BotPasswordAuth({
     *       username: 'MainAccount@BotName',
     *       password: 'botpassword123',
     *       userAgent: 'MyIWFBot/1.0 (https://example.com/my-bot-info)'
     *   });
     */
    constructor(config: BotPasswordConfig) {
        if (!config.username.includes('@')) {
            throw new Error('Bot password username must be in format "MainAccount@BotName"');
        }

        this.username = config.username;
        this.password = config.password;
        this.userAgent = config.userAgent;

        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'User-Agent': this.userAgent
            },
            withCredentials: true
        });

        // Intercept responses to store cookies
        this.axiosInstance.interceptors.response.use((response: AxiosResponse) => {
            const { 'set-cookie': setCookie } = response.headers;
            if (setCookie) {
                const { origin } = new URL(response.config.url || '');
                const existing = this.cookies.get(origin) || [];
                this.cookies.set(origin, [...existing, ...setCookie]);
            }
            return response;
        });

        // Intercept requests to add cookies
        this.axiosInstance.interceptors.request.use((requestConfig) => {
            const { origin } = new URL(requestConfig.url || '');
            const storedCookies = this.cookies.get(origin);
            if (storedCookies) {
                const cookieHeader = storedCookies
                    .map((c) => c.split(';')[0])
                    .join('; ');
                // eslint-disable-next-line no-param-reassign
                requestConfig.headers.Cookie = cookieHeader;
            }
            return requestConfig;
        });
    }

    /**
     * Ensures the user is logged in to the specified site
     *
     * @param {string} site The site URL
     * @returns {Promise<void>} Resolves when logged in
     * @example
     *   await botAuth.ensureLoggedIn('https://en.wikipedia.org');
     */
    async ensureLoggedIn(site: string): Promise<void> {
        if (this.loggedInSites.has(site)) {
            return;
        }

        const siteURL = new URL(site);
        const apiURL = `${siteURL.origin}/w/api.php`;

        // Step 1: Get login token
        const tokenResponse = await this.axiosInstance.get<LoginTokenResponse>(
            `${apiURL}?${qs.stringify({
                action: 'query',
                meta: 'tokens',
                type: 'login',
                format: 'json'
            })}`
        );

        const loginToken = tokenResponse.data.query.tokens.logintoken;
        if (!loginToken) {
            throw new NotLoggedInError('Failed to obtain login token');
        }

        // Step 2: Perform login
        const loginResponse = await this.axiosInstance.post<LoginResponse>(
            apiURL,
            qs.stringify({
                action: 'login',
                lgname: this.username,
                lgpassword: this.password,
                lgtoken: loginToken,
                format: 'json'
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const { result, reason } = loginResponse.data.login;
        if (result !== 'Success') {
            throw new PermissionDeniedError(
                reason ? `Login failed: ${result} - ${reason}` : `Login failed: ${result}`,
                { site, username: this.username }
            );
        }

        this.loggedInSites.add(site);
    }

    /**
     * Get a CSRF token for the specified site
     *
     * @param {string} site The site URL
     * @returns {Promise<string>} The CSRF token
     * @example
     *   const csrfToken = await botAuth.getCsrfToken('https://en.wikipedia.org');
     */
    async getCsrfToken(site: string): Promise<string> {
        await this.ensureLoggedIn(site);

        const cached = this.csrfTokenCache.get(site);
        if (cached) {
            return cached;
        }

        const siteURL = new URL(site);
        const apiURL = `${siteURL.origin}/w/api.php`;

        const response = await this.axiosInstance.get<CsrfTokenResponse>(
            `${apiURL}?${qs.stringify({
                action: 'query',
                meta: 'tokens',
                type: 'csrf',
                format: 'json'
            })}`
        );

        const csrfToken = response.data.query.tokens.csrftoken;
        if (!csrfToken || csrfToken === '+\\') {
            throw new NotLoggedInError('Failed to obtain CSRF token - may not be logged in');
        }

        this.csrfTokenCache.set(site, csrfToken);
        return csrfToken;
    }

    /**
     * Clears cached login state and tokens, forcing re-login on next request
     *
     * @example
     *   botAuth.clearCache();
     */
    clearCache(): void {
        this.loggedInSites.clear();
        this.csrfTokenCache.clear();
        this.cookies.clear();
    }

    /**
     * Gets the axios instance (for use in upload operations)
     *
     * @returns {AxiosInstance} The axios instance
     *
     * @example
     *   const axiosInstance = botAuth.getAxiosInstance();
     */
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    /**
     * Gets the user agent string
     *
     * @returns {string} The user agent
     *
     * @example
     *   const userAgent = botAuth.getUserAgent();
     */
    getUserAgent(): string {
        return this.userAgent;
    }
}
