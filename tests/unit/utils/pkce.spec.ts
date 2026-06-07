import { generateCodeChallenge, generateCodeVerifier } from '../../../src/utils/pkce';

type TestCrypto = {
    getRandomValues: (typedArray: Uint8Array) => Uint8Array;
    subtle: {
        digest: (algorithm: string, data: ArrayBuffer) => Promise<ArrayBuffer>;
    };
};

describe('pkce', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('generates deterministic PKCE verifier and challenge values', async () => {
        const globals = globalThis as unknown as Record<string, unknown>;
        const testCrypto = Reflect.get(globals, 'crypto') as TestCrypto;

        vi.spyOn(testCrypto, 'getRandomValues').mockImplementation((((typedArray) => {
            if (typedArray instanceof Uint8Array) {
                typedArray.set([1, 2, 3, 4]);
            }

            return typedArray;
        })));
        vi.spyOn(testCrypto.subtle, 'digest').mockResolvedValue(Uint8Array.from([5, 6, 7, 8]).buffer);

        expect(generateCodeVerifier(4)).toBe('AQIDBA');
        await expect(generateCodeChallenge('verifier')).resolves.toBe('BQYHCA');
    });
});
