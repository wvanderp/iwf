import {
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
} from '../../../src/auth/errors';

describe('IWFError', () => {
    it('should create basic error', () => {
        const error = new IWFError('Test error', 'TEST_CODE');

        expect(error.message).toBe('Test error');
        expect(error.code).toBe('TEST_CODE');
        expect(error.name).toBe('IWFError');
    });

    it('should include details', () => {
        const error = new IWFError('Test error', 'TEST_CODE', {
            wiki: 'https://www.wikidata.org',
            title: 'Q42',
            custom: 'value'
        });

        expect(error.wiki).toBe('https://www.wikidata.org');
        expect(error.title).toBe('Q42');
        expect(error.details?.custom).toBe('value');
    });
});

describe('AuthExpiredError', () => {
    it('should have correct code', () => {
        const error = new AuthExpiredError('Token expired');

        expect(error.code).toBe('AUTH_EXPIRED');
        expect(error.message).toBe('Token expired');
        expect(error.name).toBe('AuthExpiredError');
    });
});

describe('NotLoggedInError', () => {
    it('should have correct code', () => {
        const error = new NotLoggedInError('Not logged in');

        expect(error.code).toBe('NOT_LOGGED_IN');
        expect(error.message).toBe('Not logged in');
    });
});

describe('PermissionDeniedError', () => {
    it('should have correct code', () => {
        const error = new PermissionDeniedError('Permission denied');

        expect(error.code).toBe('PERMISSION_DENIED');
        expect(error.message).toBe('Permission denied');
    });
});

describe('RateLimitedError', () => {
    it('should have correct code and retryAfter', () => {
        const error = new RateLimitedError('Rate limited', 60);

        expect(error.code).toBe('RATE_LIMITED');
        expect(error.message).toBe('Rate limited');
        expect(error.retryAfter).toBe(60);
    });

    it('should work without retryAfter', () => {
        const error = new RateLimitedError('Rate limited');

        expect(error.code).toBe('RATE_LIMITED');
        expect(error.retryAfter).toBeUndefined();
    });
});

describe('AbuseFilterError', () => {
    it('should have correct code and filterId', () => {
        const error = new AbuseFilterError('Blocked by abuse filter', '123');

        expect(error.code).toBe('ABUSE_FILTER');
        expect(error.message).toBe('Blocked by abuse filter');
        expect(error.filterId).toBe('123');
    });
});

describe('SpamBlocklistError', () => {
    it('should have correct code', () => {
        const error = new SpamBlocklistError('Spam detected');

        expect(error.code).toBe('SPAM_BLOCKLIST');
        expect(error.message).toBe('Spam detected');
    });
});

describe('CaptchaNeededError', () => {
    it('should have correct code and captcha info', () => {
        const error = new CaptchaNeededError('Captcha required', 'cap123', 'recaptcha');

        expect(error.code).toBe('CAPTCHA_NEEDED');
        expect(error.message).toBe('Captcha required');
        expect(error.captchaId).toBe('cap123');
        expect(error.captchaType).toBe('recaptcha');
    });
});

describe('NetworkError', () => {
    it('should have correct code', () => {
        const error = new NetworkError('Connection failed');

        expect(error.code).toBe('NETWORK_ERROR');
        expect(error.message).toBe('Connection failed');
    });
});

describe('APIError', () => {
    it('should have correct code and apiCode', () => {
        const error = new APIError('API error', 'unknowncode');

        expect(error.code).toBe('API_ERROR');
        expect(error.message).toBe('API error');
        expect(error.apiCode).toBe('unknowncode');
    });
});

describe('mapAPIError', () => {
    it('should map notloggedin to NotLoggedInError', () => {
        const error = mapAPIError('notloggedin', 'User is not logged in');

        expect(error).toBeInstanceOf(NotLoggedInError);
        expect(error.code).toBe('NOT_LOGGED_IN');
    });

    it('should map assertuserfailed to NotLoggedInError', () => {
        const error = mapAPIError('assertuserfailed', 'Assert user failed');

        expect(error).toBeInstanceOf(NotLoggedInError);
    });

    it('should map permissiondenied to PermissionDeniedError', () => {
        const error = mapAPIError('permissiondenied', 'Permission denied');

        expect(error).toBeInstanceOf(PermissionDeniedError);
        expect(error.code).toBe('PERMISSION_DENIED');
    });

    it('should map blocked to PermissionDeniedError', () => {
        const error = mapAPIError('blocked', 'User is blocked');

        expect(error).toBeInstanceOf(PermissionDeniedError);
    });

    it('should map ratelimited to RateLimitedError', () => {
        const error = mapAPIError('ratelimited', 'Rate limit exceeded');

        expect(error).toBeInstanceOf(RateLimitedError);
        expect(error.code).toBe('RATE_LIMITED');
    });

    it('should map abusefilter-disallowed to AbuseFilterError', () => {
        const error = mapAPIError(
            'abusefilter-disallowed',
            'Edit blocked by abuse filter',
            { filter: '123' }
        );

        expect(error).toBeInstanceOf(AbuseFilterError);
        expect(error.code).toBe('ABUSE_FILTER');
        expect((error as AbuseFilterError).filterId).toBe('123');
    });

    it('should map spamblacklist to SpamBlocklistError', () => {
        const error = mapAPIError('spamblacklist', 'Spam detected');

        expect(error).toBeInstanceOf(SpamBlocklistError);
        expect(error.code).toBe('SPAM_BLOCKLIST');
    });

    it('should map captcha to CaptchaNeededError', () => {
        const error = mapAPIError(
            'captcha',
            'Captcha required',
            { captcha: 'cap123', type: 'recaptcha' }
        );

        expect(error).toBeInstanceOf(CaptchaNeededError);
        expect(error.code).toBe('CAPTCHA_NEEDED');
        expect((error as CaptchaNeededError).captchaId).toBe('cap123');
        expect((error as CaptchaNeededError).captchaType).toBe('recaptcha');
    });

    it('should map unknown codes to APIError', () => {
        const error = mapAPIError('unknowncode', 'Unknown error');

        expect(error).toBeInstanceOf(APIError);
        expect(error.code).toBe('API_ERROR');
        expect((error as APIError).apiCode).toBe('unknowncode');
    });

    it('should preserve details in mapped errors', () => {
        const error = mapAPIError('notloggedin', 'Not logged in', {
            wiki: 'https://www.wikidata.org',
            title: 'Q42'
        });

        expect(error.wiki).toBe('https://www.wikidata.org');
        expect(error.title).toBe('Q42');
    });
});
