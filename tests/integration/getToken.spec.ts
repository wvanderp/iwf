import * as dotenv from 'dotenv';
import { BotPasswordAuth } from '../../src';

dotenv.config();
declare let process: {
    env: {
        WIKIDATA_USERNAME: string;
        WIKIDATA_PASSWORD: string;
    }
};

const testServer = 'https://test.wikidata.org';

describe('BotPasswordAuth', () => {
    it('should login and get a CSRF token', async function () {
        jest.setTimeout(60000);

        expect(typeof process.env.WIKIDATA_USERNAME).toBe('string');
        expect(typeof process.env.WIKIDATA_PASSWORD).toBe('string');
        expect(process.env.WIKIDATA_USERNAME).not.toEqual('');
        expect(process.env.WIKIDATA_PASSWORD).not.toEqual('');

        const auth = new BotPasswordAuth({
            username: process.env.WIKIDATA_USERNAME,
            password: process.env.WIKIDATA_PASSWORD,
            userAgent: 'IWF Integration Test/1.0'
        });

        const csrfToken = await auth.getCsrfToken(testServer);

        expect(typeof csrfToken).toBe('string');
        expect(csrfToken).not.toEqual('+\\');
        expect(csrfToken.length).toBeGreaterThan(0);
    });

    it('should fail gracefully when given wrong credentials', async function () {
        jest.setTimeout(60000);

        const auth = new BotPasswordAuth({
            username: 'wrongUsername@wrongBot',
            password: 'theWrongPassword',
            userAgent: 'IWF Integration Test/1.0'
        });

        await expect(auth.getCsrfToken(testServer)).rejects.toThrow();
    });
});
