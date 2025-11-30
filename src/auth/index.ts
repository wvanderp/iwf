/**
 * Authentication module for iwf
 * Provides Bot Password authentication for MediaWiki APIs
 */

export { default as BotPasswordAuth } from './BotPasswordAuth';

export { BotPasswordConfig } from './types';

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

export {
    redactHeaders,
    calculateBackoffDelay,
    parseRetryAfter
} from './utils';
