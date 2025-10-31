/**
 * Core types and interfaces for authentication
 */

/**
 * Configuration for an authentication request
 */
export interface RequestConfig {
    headers?: Record<string, string>;
    [key: string]: unknown;
}

/**
 * Base interface for all authentication providers
 */
export interface AuthProvider {
    /**
     * Adds authentication to a request configuration
     *
     * @param request The base request configuration
     * @returns The request configuration with authentication added
     */
    authorize(request: RequestConfig): Promise<RequestConfig>;

    /**
     * Fetches a CSRF token for the given site
     *
     * @param site The wiki site URL (e.g., 'https://www.wikidata.org')
     * @returns The CSRF token
     */
    getCsrfToken(site: string): Promise<string>;

    /**
     * Optional hook called when an authentication error occurs
     * Allows the provider to attempt recovery (e.g., refresh tokens)
     *
     * @param error The error that occurred
     */
    onAuthError?(error: Error): Promise<void>;
}

/**
 * Interface for storing and retrieving refresh tokens
 */
export interface TokenStore {
    /**
     * Load a refresh token from storage
     *
     * @param key Optional key to identify which token to load
     * @returns The refresh token, or undefined if not found
     */
    loadRefreshToken(key?: string): Promise<string | undefined>;

    /**
     * Save a refresh token to storage
     *
     * @param value The refresh token to save
     * @param key Optional key to identify the token
     */
    saveRefreshToken(value: string, key?: string): Promise<void>;
}

/**
 * OAuth 2.0 access token with expiry information
 */
export interface AccessToken {
    token: string;
    expiresAt: number; // Unix timestamp in milliseconds
}

/**
 * OAuth 2.0 token response from the authorization server
 */
export interface OAuth2TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

/**
 * Configuration for creating an axios instance
 */
export interface AxiosConfig {
    site: string;
    userAgent: string;
    timeout?: number;
    maxRetries?: number;
    baseDelay?: number;
}

/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
    maxRetries: number;
    baseDelay: number; // milliseconds
    maxDelay: number; // milliseconds
    jitter: boolean;
}

/**
 * OAuth 2.0 configuration
 */
export interface OAuth2Config {
    clientId: string;
    clientSecret?: string;
    tokenStore?: TokenStore;
    scopes?: string[];
    userAgent: string;
    tokenEndpoint?: string;
    authorizeEndpoint?: string;
}

/**
 * Bot password configuration
 */
export interface BotPasswordConfig {
    username: string; // Should be in format "MainAccount@BotName"
    password: string; // Bot password, not main account password
    userAgent: string;
}

/**
 * PKCE (Proof Key for Code Exchange) parameters
 */
export interface PKCEParameters {
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: string;
}
