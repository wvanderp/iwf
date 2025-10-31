/**
 * Authentication module for iwf
 * Provides OAuth 2.0 and Bot Password authentication for MediaWiki APIs
 */

export { OAuth2AuthCode } from './OAuth2AuthCode';
export { BotPasswordAuth } from './BotPasswordAuth';
export { FileTokenStore, MemoryTokenStore } from './tokenStore';

export {
    AuthProvider,
    TokenStore,
    OAuth2Config,
    BotPasswordConfig,
    RequestConfig,
    AccessToken,
    OAuth2TokenResponse,
    PKCEParams,
    AxiosConfig,
    RetryConfig
} from './types';

export {
    IWFError,
    AuthExpiredError,
    NotLoggedInError,
    PermissionDeniedError,
    RateLimitedError,
    AbuseFilterError,
    SpamBlacklistError,
    CaptchaNeededError,
    NetworkError,
    APIError,
    mapAPIError
} from './errors';

export { createAxios, createAxiosWithCookieJar } from './axios';
export {
    redactHeaders,
    generateCodeVerifier,
    generateCodeChallenge,
    calculateBackoffDelay,
    parseRetryAfter
} from './utils';
