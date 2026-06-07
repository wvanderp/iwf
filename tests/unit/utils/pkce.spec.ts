import { generateCodeChallenge, generateCodeVerifier } from '../../../src/utils/pkce';

type CryptoRandomValues = typeof globalThis.crypto.getRandomValues;

describe('pkce', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('generates deterministic PKCE verifier and challenge values', async () => {
        vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation((((typedArray) => {
            if (typedArray instanceof Uint8Array) {
                typedArray.set([1, 2, 3, 4]);
            }

            return typedArray;
        }) as CryptoRandomValues));
        vi.spyOn(globalThis.crypto.subtle, 'digest').mockResolvedValue(Uint8Array.from([5, 6, 7, 8]).buffer);

        expect(generateCodeVerifier(4)).toBe('AQIDBA');
        await expect(generateCodeChallenge('verifier')).resolves.toBe('BQYHCA');
    });
});
