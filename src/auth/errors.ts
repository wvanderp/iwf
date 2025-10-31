/**
 * Base class for all iwf authentication errors
 */
export class IWFError extends Error {
    public readonly code: string;
    public readonly wiki?: string;
    public readonly title?: string;
    public readonly details?: Record<string, unknown>;

    constructor(message: string, code: string, details?: { wiki?: string; title?: string; [key: string]: unknown }) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.wiki = details?.wiki;
        this.title = details?.title;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when authentication credentials have expired
 * Typically a 401 or invalid_token response
 */
export class AuthExpiredError extends IWFError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'AUTH_EXPIRED', details);
    }
}

/**
 * Thrown when user is not logged in or session is invalid
 */
export class NotLoggedInError extends IWFError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'NOT_LOGGED_IN', details);
    }
}

/**
 * Thrown when user lacks required permissions
 */
export class PermissionDeniedError extends IWFError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'PERMISSION_DENIED', details);
    }
}

/**
 * Thrown when rate limit is exceeded
 */
export class RateLimitedError extends IWFError {
    public readonly retryAfter?: number; // seconds

    constructor(message: string, retryAfter?: number, details?: Record<string, unknown>) {
        super(message, 'RATE_LIMITED', details);
        this.retryAfter = retryAfter;
    }
}

/**
 * Thrown when edit is blocked by abuse filter
 */
export class AbuseFilterError extends IWFError {
    public readonly filterId?: string;

    constructor(message: string, filterId?: string, details?: Record<string, unknown>) {
        super(message, 'ABUSE_FILTER', { ...details, filterId });
        this.filterId = filterId;
    }
}

/**
 * Thrown when content is blocked by spam blacklist
 */
export class SpamBlacklistError extends IWFError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'SPAM_BLACKLIST', details);
    }
}

/**
 * Thrown when captcha is required
 */
export class CaptchaNeededError extends IWFError {
    public readonly captchaId?: string;
    public readonly captchaType?: string;

    constructor(message: string, captchaId?: string, captchaType?: string, details?: Record<string, unknown>) {
        super(message, 'CAPTCHA_NEEDED', { ...details, captchaId, captchaType });
        this.captchaId = captchaId;
        this.captchaType = captchaType;
    }
}

/**
 * Thrown on network-level failures
 */
export class NetworkError extends IWFError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'NETWORK_ERROR', details);
    }
}

/**
 * Thrown when API returns an unexpected or unhandled error
 */
export class APIError extends IWFError {
    public readonly apiCode?: string;

    constructor(message: string, apiCode?: string, details?: Record<string, unknown>) {
        super(message, 'API_ERROR', { ...details, apiCode });
        this.apiCode = apiCode;
    }
}

/**
 * Maps MediaWiki API error codes to typed errors
 */
export function mapAPIError(
    apiErrorCode: string,
    message: string,
    details?: Record<string, unknown>
): IWFError {
    switch (apiErrorCode) {
        case 'notloggedin':
        case 'assertuserfailed':
        case 'assertnameduserfailed':
            return new NotLoggedInError(message, { ...details, apiCode: apiErrorCode });

        case 'permissiondenied':
        case 'badtoken':
        case 'readonly':
        case 'blocked':
        case 'autoblocked':
            return new PermissionDeniedError(message, { ...details, apiCode: apiErrorCode });

        case 'ratelimited':
        case 'maxlag':
            return new RateLimitedError(message, undefined, { ...details, apiCode: apiErrorCode });

        case 'abusefilter-disallowed':
        case 'abusefilter-warning':
            return new AbuseFilterError(message, details?.filter as string, { ...details, apiCode: apiErrorCode });

        case 'spamblacklist':
        case 'spam-blacklist':
            return new SpamBlacklistError(message, { ...details, apiCode: apiErrorCode });

        case 'captcha':
            return new CaptchaNeededError(
                message,
                details?.captcha as string,
                details?.type as string,
                { ...details, apiCode: apiErrorCode }
            );

        default:
            return new APIError(message, apiErrorCode, details);
    }
}
