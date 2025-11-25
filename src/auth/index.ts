/**
 * Authentication module for iwf
 * Provides Bot Password authentication for MediaWiki APIs
 */

export { default as BotPasswordAuth } from './BotPasswordAuth';

export {
    AuthProvider,
    BotPasswordConfig,
    RequestConfig,
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
    SpamBlocklistError,
    CaptchaNeededError,
    NetworkError,
    APIError,
    mapAPIError
} from './errors';

export { createAxios, createAxiosWithCookieJar } from './axios';
export {
    redactHeaders,
    calculateBackoffDelay,
    parseRetryAfter
} from './utils';
