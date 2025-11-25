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
 * Bot password configuration
 */
export interface BotPasswordConfig {
    username: string; // Should be in format "MainAccount@BotName"
    password: string; // Bot password, not main account password
    userAgent: string;
}
