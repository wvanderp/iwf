import {
    redactHeaders,
    calculateBackoffDelay,
    parseRetryAfter
} from '../../../src/auth/utils';

describe('redactHeaders', () => {
    it('should redact sensitive headers', () => {
        const headers = {
            Authorization: 'Bearer secret-token',
            Cookie: 'session=abc123',
            'Set-Cookie': 'session=def456',
            'Content-Type': 'application/json',
            'User-Agent': 'test-agent'
        };

        const redacted = redactHeaders(headers);

        expect(redacted.Authorization).toBe('[REDACTED]');
        expect(redacted.Cookie).toBe('[REDACTED]');
        expect(redacted['Set-Cookie']).toBe('[REDACTED]');
        expect(redacted['Content-Type']).toBe('application/json');
        expect(redacted['User-Agent']).toBe('test-agent');
    });

    it('should handle case-insensitive header names', () => {
        const headers = {
            authorization: 'Bearer secret-token',
            COOKIE: 'session=abc123'
        };

        const redacted = redactHeaders(headers);

        expect(redacted.authorization).toBe('[REDACTED]');
        expect(redacted.COOKIE).toBe('[REDACTED]');
    });

    it('should not modify original headers object', () => {
        const headers = {
            Authorization: 'Bearer secret-token'
        };

        const redacted = redactHeaders(headers);

        expect(headers.Authorization).toBe('Bearer secret-token');
        expect(redacted.Authorization).toBe('[REDACTED]');
    });
});

describe('calculateBackoffDelay', () => {
    it('should calculate exponential backoff', () => {
        const baseDelay = 1000;
        const maxDelay = 30000;

        const delay0 = calculateBackoffDelay(0, baseDelay, maxDelay, false);
        const delay1 = calculateBackoffDelay(1, baseDelay, maxDelay, false);
        const delay2 = calculateBackoffDelay(2, baseDelay, maxDelay, false);

        expect(delay0).toBe(1000);
        expect(delay1).toBe(2000);
        expect(delay2).toBe(4000);
    });

    it('should respect max delay', () => {
        const baseDelay = 1000;
        const maxDelay = 5000;

        const delay10 = calculateBackoffDelay(10, baseDelay, maxDelay, false);

        expect(delay10).toBe(maxDelay);
    });

    it('should add jitter when enabled', () => {
        const baseDelay = 1000;
        const maxDelay = 30000;
        const attempt = 2;
        const expectedBase = 4000;

        // Run multiple times to ensure jitter is applied
        const delays = Array.from({ length: 10 }, () => calculateBackoffDelay(attempt, baseDelay, maxDelay, true));

        // Should have some variation
        const uniqueDelays = new Set(delays);
        expect(uniqueDelays.size).toBeGreaterThan(1);

        // All delays should be within ±25% of base
        for (const delay of delays) {
            expect(delay).toBeGreaterThanOrEqual(expectedBase * 0.75);
            expect(delay).toBeLessThanOrEqual(expectedBase * 1.25);
        }
    });

    it('should not add jitter when disabled', () => {
        const baseDelay = 1000;
        const maxDelay = 30000;
        const attempt = 2;

        const delay1 = calculateBackoffDelay(attempt, baseDelay, maxDelay, false);
        const delay2 = calculateBackoffDelay(attempt, baseDelay, maxDelay, false);

        expect(delay1).toBe(delay2);
        expect(delay1).toBe(4000);
    });

    it('should never return negative delay', () => {
        const baseDelay = 1000;
        const maxDelay = 30000;

        for (let attempt = 0; attempt < 10; attempt += 1) {
            const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay, true);
            expect(delay).toBeGreaterThanOrEqual(0);
        }
    });
});

describe('parseRetryAfter', () => {
    it('should parse delay-seconds format', () => {
        expect(parseRetryAfter('60')).toBe(60);
        expect(parseRetryAfter('120')).toBe(120);
        expect(parseRetryAfter('0')).toBe(0);
    });

    it('should parse HTTP-date format', () => {
        const futureDate = new Date(Date.now() + 60000); // 60 seconds from now
        const retryAfter = parseRetryAfter(futureDate.toUTCString());

        expect(retryAfter).toBeGreaterThanOrEqual(59); // Allow for small timing differences
        expect(retryAfter).toBeLessThanOrEqual(61);
    });

    it('should return undefined for invalid input', () => {
        // @ts-expect-error forcing invalid input
        expect(parseRetryAfter()).toBeUndefined();
        expect(parseRetryAfter('invalid')).toBeUndefined();
        expect(parseRetryAfter('')).toBeUndefined();
    });

    it('should return 0 for past dates', () => {
        const pastDate = new Date(Date.now() - 60000); // 60 seconds ago
        const retryAfter = parseRetryAfter(pastDate.toUTCString());

        expect(retryAfter).toBe(0);
    });
});
