/**
 * Redacts sensitive information from headers
 *
 * @param headers
 * @example
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
 * @param attempt The attempt number (0-indexed)
 * @param baseDelay Base delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 * @param jitter Whether to add jitter
 * @example
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
 * @param retryAfter The Retry-After header value (either seconds or HTTP date)
 * @returns Delay in seconds, or undefined if invalid
 * @example
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
