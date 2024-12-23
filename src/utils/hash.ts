import { Sha256 } from '@aws-crypto/sha256-js';

/**
 * Calculates the SHA256 hash of a string
 *
 * @param {string} input  the string to hash
 * @returns {string} the hash of the string
 * @example
 *    const hash = sha256('hello');
 *   console.log(hash); // 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
 */
export default function sha256(input: string): string {
    const hash = new Sha256();
    hash.update(input);
    // Convert the hash to a Uint8Array and then use reduce to convert each byte to a hexadecimal string
    // padStart ensures each byte is represented by two hexadecimal characters
    return new Uint8Array(hash.digestSync())
        .reduce((string_, byte) => string_ + byte.toString(16).padStart(2, '0'), '');
}
