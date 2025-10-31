import axios, {
    AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig
} from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { AxiosConfig, RetryConfig } from './types';
import { calculateBackoffDelay, parseRetryAfter } from './utils';
import { RateLimitedError, NetworkError } from './errors';

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY = 1000; // 1 second
const DEFAULT_MAX_DELAY = 30000; // 30 seconds

/**
 * Determines if an error is retryable
 *
 * @param error
 * @example
 */
function isRetryableError(error: AxiosError): boolean {
    // No response means network error - retryable
    if (!error.response) {
        return true;
    }

    const { status } = error.response;

    // 429 (Too Many Requests) - retryable
    if (status === 429) {
        return true;
    }

    // 5xx (Server Errors) - retryable
    return status >= 500 && status < 600;
}

/**
 * Maps axios errors to our error types
 *
 * @param error
 * @example
 */
function mapAxiosError(error: AxiosError): Error {
    if (!error.response) {
        return new NetworkError(
            error.message || 'Network request failed',
            { originalError: error.code }
        );
    }

    const { status } = error.response;

    if (status === 429) {
        const retryAfter = parseRetryAfter(error.response.headers['retry-after'] as string);
        return new RateLimitedError(
            'Rate limit exceeded',
            retryAfter,
            { status }
        );
    }

    // For other errors, return as-is to be handled by higher level error mapping
    return error;
}

/**
 * Creates a configured axios instance for a specific wiki site
 *
 * @param config
 * @example
 */
export function createAxios(config: AxiosConfig): AxiosInstance {
    const siteURL = new URL(config.site);
    const baseURL = `${siteURL.origin}/w/api.php`;

    const retryConfig: RetryConfig = {
        maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
        baseDelay: config.baseDelay ?? DEFAULT_BASE_DELAY,
        maxDelay: DEFAULT_MAX_DELAY,
        jitter: true
    };

    const instance = axios.create({
        baseURL,
        timeout: config.timeout ?? DEFAULT_TIMEOUT,
        headers: {
            'User-Agent': config.userAgent
        }
    });

    // Add retry interceptor for 429 and 5xx errors
    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const axiosConfig = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

            if (!axiosConfig) {
                throw error;
            }

            // Initialize retry count
            axiosConfig._retryCount = axiosConfig._retryCount ?? 0;

            // Check if we should retry
            const shouldRetry = isRetryableError(error) && axiosConfig._retryCount < retryConfig.maxRetries;

            if (!shouldRetry) {
                throw mapAxiosError(error);
            }

            // Calculate delay
            const retryAfter = parseRetryAfter(error.response?.headers['retry-after'] as string);
            const delayMs = retryAfter === undefined ? calculateBackoffDelay(
                axiosConfig._retryCount,
                retryConfig.baseDelay,
                retryConfig.maxDelay,
                retryConfig.jitter
            ) : retryAfter * 1000;

            // Increment retry count
            axiosConfig._retryCount += 1;

            // Wait and retry
            await new Promise((resolve) => { setTimeout(resolve, delayMs); });
            return instance(axiosConfig);
        }
    );

    return instance;
}

/**
 * Creates an axios instance with cookie jar support for Bot Password authentication
 *
 * @param config
 * @example
 */
export function createAxiosWithCookieJar(config: AxiosConfig): { instance: AxiosInstance; jar: CookieJar } {
    const jar = new CookieJar();
    const instance = createAxios(config);

    // Wrap with cookie jar support
    wrapper(instance);
    (instance.defaults as AxiosRequestConfig & { jar?: CookieJar }).jar = jar;

    return { instance, jar };
}
