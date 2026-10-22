import axios from 'axios';

import { AuthProvider } from '../../../../src/auth/types';
import Item from '../../../../src/Item';
import upload, { UploadOptions, validateAuthentication } from '../../../../src/utils/api/upload';

const getCsrfToken = vi.fn().mockResolvedValue('test-csrf-token');
const auth: AuthProvider = {
    getCsrfToken,
    getAxiosInstance: () => axios.create(),
    getUserAgent: () => 'UploadOptionsTest/1.0'
};

describe('UploadOptions authentication contract', () => {
    it('accepts ordinary authenticated and anonymous options', () => {
        const options: UploadOptions[] = [
            { summary: 'Edit', auth },
            { summary: 'Edit', auth, anonymous: false },
            { summary: 'Edit', auth, assert: 'user' },
            { summary: 'Edit', auth, assert: 'bot' },
            { summary: 'Edit', anonymous: true },
            { summary: 'Edit', anonymous: true, assert: 'anon' }
        ];

        expect(options.map((option) => validateAuthentication(option))).toEqual([
            'auth', 'auth', 'auth', 'auth', 'anonymous', 'anonymous'
        ]);
    });

    it('rejects contradictory options at compile time and runtime', () => {
        // @ts-expect-error Anonymous uploads cannot supply an authenticated provider.
        const mixedOptions: UploadOptions = { summary: 'Edit', anonymous: true, auth };
        // @ts-expect-error Anonymous uploads cannot assert a registered user.
        const userOptions: UploadOptions = { summary: 'Edit', anonymous: true, assert: 'user' };
        // @ts-expect-error Anonymous uploads cannot assert a bot account.
        const botOptions: UploadOptions = { summary: 'Edit', anonymous: true, assert: 'bot' };
        // @ts-expect-error Authenticated uploads cannot assert an anonymous session.
        const anonymousOptions: UploadOptions = { summary: 'Edit', auth, assert: 'anon' };
        // @ts-expect-error An authentication method is required.
        const missingOptions: UploadOptions = { summary: 'Edit' };

        for (const options of [mixedOptions, userOptions, botOptions, anonymousOptions, missingOptions]) {
            expect(() => validateAuthentication(options)).toThrow();
        }
    });

    it.each([
        { summary: 'Edit', anonymous: true, assert: 'user' },
        { summary: 'Edit', anonymous: true, assert: 'bot' },
        { summary: 'Edit', anonymous: true, assert: 'invalid' },
        { summary: 'Edit', auth, assert: 'anon' },
        { summary: 'Edit', auth, assert: 'invalid' }
    ])('rejects incompatible JavaScript assertions before requesting a token: $assert', async (options) => {
        getCsrfToken.mockClear();

        await expect(upload(Item.fromNothing(), options as unknown as UploadOptions)).rejects.toThrow(TypeError);
        expect(getCsrfToken).not.toHaveBeenCalled();
    });

    it('describes the provider-neutral authentication requirement', () => {
        expect(() => validateAuthentication({ summary: 'Edit' } as UploadOptions)).toThrow(
            'Provide an AuthProvider through auth, or set anonymous to true.'
        );
    });
});
