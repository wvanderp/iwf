import * as dotenv from 'dotenv';
import { getToken } from '../../src';

dotenv.config();
declare let process : {
    env: {
        WIKIDATA_USERNAME: string;
        WIKIDATA_PASSWORD: string;
    }
};

describe('get login token', () => {
    it('should return a login token', async function () {
        jest.setTimeout(60000);

        expect(typeof process.env.WIKIDATA_USERNAME).toBe('string');
        expect(typeof process.env.WIKIDATA_PASSWORD).toBe('string');
        expect(process.env.WIKIDATA_USERNAME).not.toEqual('');
        expect(process.env.WIKIDATA_PASSWORD).not.toEqual('');

        const token = await getToken(
            process.env.WIKIDATA_USERNAME,
            process.env.WIKIDATA_PASSWORD
        );

        expect(token).toBeInstanceOf(Object);
        expect(token).toHaveProperty('token');
        expect(token).toHaveProperty('cookie');
        expect(typeof token.token).toBe('string');
        expect(typeof token.cookie).toBe('string');

        expect(token.token).not.toEqual('+\\');
        expect(token.cookie).not.toEqual('');
    });

    it('should fail gracefully when given wrong credentials', async function () {
        jest.setTimeout(60000);

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const failFunction = async () => {
            await getToken(
                'wrongUsername',
                'theWrongPassword'
            );
        };

        await expect(failFunction()).rejects.toThrow();
    });
});
