/**
 * Redacts sensitive information from headers
 *
 * @param {Record<string, string>} headers The headers to redact
 * @returns {Record<string, string>} The redacted headers
 * @example
 *   const headers = {
 *      'Authorization': 'Bearer token123',
 *      'Content-Type': 'application/json',
 *      'Cookie': 'sessionid=abc123'
 *  };
 *  const redacted = redactHeaders(headers);
 *  // redacted = {
 *     'Authorization': '[REDACTED]',
 *     'Content-Type': 'application/json',
 *     'Cookie': '[REDACTED]'
 *  };
 */
export function redactHeaders(headers: Record<string, string>): Record<string, string> {
    const redacted = { ...headers };
    const sensitiveKeys = new Set(['authorization', 'cookie', 'set-cookie']);

    for (const key of Object.keys(redacted)) {
        if (sensitiveKeys.has(key.toLowerCase())) {
            redacted[key] = '[REDACTED]';
        }
    }

    return redacted;
}

/**
 * Calculates jittered delay for exponential backoff
 *
 * @param {number} attempt The attempt number (0-indexed)
 * @param {number} baseDelay Base delay in milliseconds
 * @param {number} maxDelay Maximum delay in milliseconds
 * @param {boolean} jitter Whether to add jitter
 * @returns {number} The calculated delay in milliseconds
 * @example
 *   const delay = calculateBackoffDelay(3, 1000, 30000, true);
 *  // delay could be around 8000 ms with jitter
 */
export function calculateBackoffDelay(
    attempt: number,
    baseDelay: number,
    maxDelay: number,
    jitter = true
): number {
    const exponentialDelay = baseDelay * (2 ** attempt);
    const cappedDelay = Math.min(exponentialDelay, maxDelay);

    if (!jitter) {
        return cappedDelay;
    }

    // Add random jitter: ±25% of the delay
    const jitterAmount = cappedDelay * 0.25;
    const jitterValue = (Math.random() - 0.5) * 2 * jitterAmount;
    return Math.max(0, cappedDelay + jitterValue);
}

/**
 * Parses Retry-After header value
 *
 * @param {string | undefined} retryAfter The Retry-After header value (either seconds or HTTP date)
 * @returns {number | undefined} Delay in seconds, or undefined if invalid
 * @example
 *  const delay = parseRetryAfter('120'); // 120
 */
export function parseRetryAfter(retryAfter: string | undefined): number | undefined {
    if (!retryAfter) {
        return undefined;
    }

    // Try to parse as number (delay-seconds)
    const delaySeconds = Number.parseInt(retryAfter, 10);
    if (!Number.isNaN(delaySeconds)) {
        return delaySeconds;
    }

    // Try to parse as HTTP-date
    const retryDate = new Date(retryAfter);
    if (!Number.isNaN(retryDate.getTime())) {
        const delayMs = retryDate.getTime() - Date.now();
        return Math.max(0, Math.ceil(delayMs / 1000));
    }

    return undefined;
}
