/**
 * Authentication module for iwf
 * Provides Bot Password and OAuth 2.0 authentication for MediaWiki APIs
 */

export { default as BotPasswordAuth } from './BotPasswordAuth';
export { default as OAuthAuth } from './OAuthAuth';

export type { BotPasswordConfig, OAuthConfig } from './types';

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
} from './utilities';
