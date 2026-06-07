/**
 * Converts a base64 string into base64url format.
 *
 * @param {string} value Base64-encoded string
 * @returns {string} Base64url-encoded string
 * @example
 *   const encoded = toBase64Url('abc+/==');
 */
function toBase64Url(value: string): string {
    const [unpaddedValue] = value.split('=');

    return unpaddedValue
        .split('+').join('-')
        .split('/').join('_');
}

/**
 * Generates a random code verifier for PKCE (Proof Key for Code Exchange) flow.
 * Used in OAuth2 authentication to prevent authorization code interception attacks.
 *
 * @param {number} length Length of the code verifier (default: 64)
 * @returns {string} Base64url-encoded random string
 * @example
 *   const verifier = generateCodeVerifier();
 */
export function generateCodeVerifier(length = 64): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return toBase64Url(btoa(String.fromCodePoint(...array)));
}

/**
 * Generates a code challenge from a verifier for PKCE flow.
 * Creates a SHA-256 hash of the verifier and encodes it as base64url.
 *
 * @param {string} verifier The code verifier to hash
 * @returns {Promise<string>} Promise resolving to base64url-encoded SHA-256 hash
 * @example
 *   const challenge = await generateCodeChallenge(verifier);
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return toBase64Url(btoa(String.fromCodePoint(...new Uint8Array(digest))));
}
