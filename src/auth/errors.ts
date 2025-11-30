/* eslint-disable max-classes-per-file */
/**
 * Base class for all iwf authentication errors
 */
export class IWFError extends Error {
    public readonly code: string;

    public readonly wiki?: string;

    public readonly title?: string;

    public readonly details?: Record<string, unknown>;

    /**
     * Creates a new IWFError instance
     *
     * @param {string} message The error message
     * @param {string} code The error code
     * @param {Record} details Additional error details
     * @param {string} [details.wiki] The wiki where the error occurred
     * @param {string} [details.title] The title related to the error
     * @returns {IWFError} The created IWFError instance
     * @example
     *   throw new IWFError('An error occurred', 'SOME_ERROR_CODE', { wiki: 'enwiki' });
     */
    constructor(message: string, code: string, details?: { wiki?: string; title?: string;[key: string]: unknown }) {
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
    /**
     * Creates a new AuthExpiredError instance
     *
     * @param {string} message The error message
     * @param {Record} details Additional error details
     * @returns {AuthExpiredError} The created AuthExpiredError instance
     * @example
     *   throw new AuthExpiredError('Authentication has expired', { wiki: 'enwiki' });
     */
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'AUTH_EXPIRED', details);
    }
}

/**
 * Thrown when user is not logged in or session is invalid
 */
export class NotLoggedInError extends IWFError {
    /**
     * Creates a new NotLoggedInError instance
     *
     * @param {string} message The error message
     * @param {Record} details Additional error details
     * @returns {NotLoggedInError} The created NotLoggedInError instance
     * @example
     *   throw new NotLoggedInError('User is not logged in', { wiki: 'enwiki' });
     */
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'NOT_LOGGED_IN', details);
    }
}

/**
 * Thrown when user lacks required permissions
 */
export class PermissionDeniedError extends IWFError {
    /**
     * Creates a new PermissionDeniedError instance
     *
     * @param {string} message The error message
     * @param {Record} details Additional error details
     * @returns {PermissionDeniedError} The created PermissionDeniedError instance
     * @example
     *   throw new PermissionDeniedError('User lacks permissions', { wiki: 'enwiki' });
     */
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'PERMISSION_DENIED', details);
    }
}

/**
 * Thrown when rate limit is exceeded
 */
export class RateLimitedError extends IWFError {
    public readonly retryAfter?: number; // seconds

    /**
     * Creates a new RateLimitedError instance
     *
     * @param {string} message The error message
     * @param {number} [retryAfter] Suggested retry after time in seconds
     * @param {Record} details Additional error details
     * @returns {RateLimitedError} The created RateLimitedError instance
     * @example
     *   throw new RateLimitedError('Rate limit exceeded', 120, { wiki: 'enwiki' });
     */
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

    /**
     * Creates a new AbuseFilterError instance
     *
     * @param {string} message The error message
     * @param {string} [filterId] The ID of the abuse filter that was triggered
     * @param {Record} details Additional error details
     * @returns {AbuseFilterError} The created AbuseFilterError instance
     * @example
     *   throw new AbuseFilterError('Edit blocked by abuse filter', '1234', { wiki: 'enwiki' });
     */
    constructor(message: string, filterId?: string, details?: Record<string, unknown>) {
        super(message, 'ABUSE_FILTER', { ...details, filterId });
        this.filterId = filterId;
    }
}

/**
 * Thrown when content is blocked by spam blocklist
 */
export class SpamBlocklistError extends IWFError {
    /**
     * Creates a new SpamBlocklistError instance
     *
     * @param {string} message The error message
     * @param {Record} details Additional error details
     * @returns {SpamBlocklistError} The created SpamBlocklistError instance
     * @example
     *   throw new SpamBlocklistError('Content blocked by spam blocklist', { wiki: 'enwiki' });
     */
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'SPAM_BLOCKLIST', details);
    }
}

/**
 * Thrown when captcha is required
 */
export class CaptchaNeededError extends IWFError {
    public readonly captchaId?: string;

    public readonly captchaType?: string;

    /**
     * Creates a new CaptchaNeededError instance
     *
     * @param {string} message The error message
     * @param {string} [captchaId] The ID of the required captcha
     * @param {string} [captchaType] The type of the required captcha
     * @param {Record} details Additional error details
     * @returns {CaptchaNeededError} The created CaptchaNeededError instance
     * @example
     *   throw new CaptchaNeededError('Captcha is required', 'captcha123', 'text', { wiki: 'enwiki' });
     */
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
    /**
     * Creates a new NetworkError instance
     *
     * @param {string} message The error message
     * @param {Record} details Additional error details
     * @returns {NetworkError} The created NetworkError instance
     * @example
     *   throw new NetworkError('Network request failed', { wiki: 'enwiki' });
     */
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'NETWORK_ERROR', details);
    }
}

/**
 * Thrown when API returns an unexpected or unhandled error
 */
export class APIError extends IWFError {
    public readonly apiCode?: string;

    /**
     * Creates a new APIError instance
     *
     * @param {string} message The error message
     * @param {string} [apiCode] The MediaWiki API error code
     * @param {Record} details Additional error details
     * @returns {APIError} The created APIError instance
     * @example
     *   throw new APIError('API returned an unknown error', 'unknown_error', { wiki: 'enwiki' });
     */
    constructor(message: string, apiCode?: string, details?: Record<string, unknown>) {
        super(message, 'API_ERROR', { ...details, apiCode });
        this.apiCode = apiCode;
    }
}

/**
 * Maps MediaWiki API error codes to typed errors
 *
 * @param {string} apiErrorCode The MediaWiki API error code
 * @param {string} message The error message
 * @param {Record} details Additional error details
 * @param {string} [details.wiki] The wiki where the error occurred
 * @param {string} [details.title] The title related to the error
 *
 * @returns {IWFError} The mapped IWFError instance
 *
 * @example
 *   const error = mapAPIError('notloggedin', 'User is not logged in', { wiki: 'enwiki' });
 *  // error is an instance of NotLoggedInError
 */
export function mapAPIError(
    apiErrorCode: string,
    message: string,
    details?: Record<string, unknown>
): IWFError {
    switch (apiErrorCode) {
        case 'notloggedin':
        case 'assertuserfailed':
        case 'assertnameduserfailed': {
            return new NotLoggedInError(message, { ...details, apiCode: apiErrorCode });
        }

        case 'permissiondenied':
        case 'badtoken':
        case 'readonly':
        case 'blocked':
        case 'autoblocked': {
            return new PermissionDeniedError(message, { ...details, apiCode: apiErrorCode });
        }

        case 'ratelimited':
        case 'maxlag': {
            return new RateLimitedError(message, undefined, { ...details, apiCode: apiErrorCode });
        }

        case 'abusefilter-disallowed':
        case 'abusefilter-warning': {
            return new AbuseFilterError(message, details?.filter as string, { ...details, apiCode: apiErrorCode });
        }

        case 'spamblacklist':
        case 'spam-blacklist': {
            return new SpamBlocklistError(message, { ...details, apiCode: apiErrorCode });
        }

        case 'captcha': {
            return new CaptchaNeededError(
                message,
                details?.captcha as string,
                details?.type as string,
                { ...details, apiCode: apiErrorCode }
            );
        }

        default: {
            return new APIError(message, apiErrorCode, details);
        }
    }
}
