import BotPasswordAuth from '../../../src/auth/BotPasswordAuth';

type AxiosInstanceWithHandlers = ReturnType<BotPasswordAuth['getAxiosInstance']> & {
    interceptors: {
        response: {
            handlers: Array<{
                fulfilled: (response: {
                    headers: { 'set-cookie'?: string[] };
                    config: { url: string };
                }) => unknown;
            }>;
        };
        request: {
            handlers: Array<{
                fulfilled: (config: { url: string; headers: Record<string, string> }) =>
                    | Promise<{ url: string; headers: Record<string, string> }>
                    | { url: string; headers: Record<string, string> };
            }>;
        };
    };
};

describe('BotPasswordAuth extra coverage', () => {
    it('stores cookies from responses and reuses them on later requests', async () => {
        const auth = new BotPasswordAuth({
            username: 'TestUser@BotName',
            password: 'botpassword123',
            userAgent: 'TestBot/1.0'
        });

        const instance = auth.getAxiosInstance() as unknown as AxiosInstanceWithHandlers;
        const responseHandler = instance.interceptors.response.handlers[0].fulfilled;
        const requestHandler = instance.interceptors.request.handlers[0].fulfilled;

        await responseHandler({
            headers: {
                'set-cookie': ['session=abc; Path=/', 'csrftoken=def; Path=/']
            },
            config: {
                url: 'https://en.wikipedia.org/w/api.php'
            }
        });

        const config = await requestHandler({
            url: 'https://en.wikipedia.org/w/api.php',
            headers: {}
        });

        expect(config.headers.Cookie).toBe('session=abc; csrftoken=def');
    });

    it('falls back to an empty URL string inside both interceptor paths', () => {
        const auth = new BotPasswordAuth({
            username: 'TestUser@BotName',
            password: 'botpassword123',
            userAgent: 'TestBot/1.0'
        });

        const instance = auth.getAxiosInstance() as unknown as AxiosInstanceWithHandlers;
        const responseHandler = instance.interceptors.response.handlers[0].fulfilled;
        const requestHandler = instance.interceptors.request.handlers[0].fulfilled;

        expect(() => responseHandler({
            headers: {
                'set-cookie': ['session=abc; Path=/']
            },
            config: {
                url: undefined as unknown as string
            }
        })).toThrow();

        expect(() => requestHandler({
            url: undefined as unknown as string,
            headers: {}
        })).toThrow();
    });

    it('returns the configured user agent', () => {
        const auth = new BotPasswordAuth({
            username: 'TestUser@BotName',
            password: 'botpassword123',
            userAgent: 'TestBot/2.0'
        });

        expect(auth.getUserAgent()).toBe('TestBot/2.0');
    });
});
