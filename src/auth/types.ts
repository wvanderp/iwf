import { AxiosInstance } from 'axios';

/**
 * Bot password configuration
 */
export interface BotPasswordConfig {
    username: string; // Format: "MainAccount@BotName"
    password: string; // Bot password, not main account password
    userAgent: string;
}

/**
 * OAuth 2.0 configuration
 */
export interface OAuthConfig {
    /** OAuth 2.0 client ID obtained from Wikimedia Special:OAuthConsumerRegistration */
    clientId: string;
    /** Redirect URI registered with the OAuth consumer (must match exactly) */
    redirectUri: string;
    /** User-Agent header sent with API requests */
    userAgent: string;
}

/** Authentication operations required by upload(), including custom providers. */
export interface AuthProvider {
    /**
     * Return a CSRF token for the authenticated account on the given site.
     *
     * @param site Server origin, such as `https://www.wikidata.org`, rather than an API endpoint.
     * @returns An authenticated, non-anonymous CSRF token; reject anonymous sessions and propagate authentication failures.
     */
    getCsrfToken(site: string): Promise<string>;
    /**
     * Return the HTTP client used to post edits. Configure it with the provider's credentials or session
     * cookies and required authentication headers. The client must propagate transport and authentication
     * failures without exposing credentials; upload() maps unsuccessful MediaWiki API response bodies.
     *
     * @returns The authenticated Axios client.
     */
    getAxiosInstance(): AxiosInstance;
    /**
     * Identify the calling application. upload() sends this User-Agent on preflight reads and edit requests;
     * provider-owned token and login requests must use the same identification themselves.
     *
     * @returns A descriptive application User-Agent, ideally including contact information.
     */
    getUserAgent(): string;
}

/** Configuration for a previously issued OAuth 2.0 bearer access token. */
export interface BearerTokenConfig {
    accessToken: string;
    userAgent: string;
    /** Optional expiry as Unix epoch seconds. Tokens expire locally 60 seconds early; no refresh is attempted. */
    expiresAt?: number;
}
