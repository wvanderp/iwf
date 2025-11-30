import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import BotPasswordAuth from '../../../src/auth/BotPasswordAuth';
import { NotLoggedInError, PermissionDeniedError } from '../../../src/auth/errors';

describe('BotPasswordAuth', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
        mock.restore();
    });

    describe('constructor', () => {
        it('should create instance with valid config', () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            expect(auth).toBeInstanceOf(BotPasswordAuth);
        });

        it('should throw error if username does not contain @', () => {
            expect(() => new BotPasswordAuth({
                username: 'TestUser',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            })).toThrow('Bot password username must be in format "MainAccount@BotName"');
        });

        it('should accept username with multiple @ symbols', () => {
            const auth = new BotPasswordAuth({
                username: 'Test@User@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            expect(auth).toBeInstanceOf(BotPasswordAuth);
        });
    });

    describe('ensureLoggedIn', () => {
        it('should successfully log in with valid credentials', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: {
                    tokens: {
                        logintoken: 'test-login-token+\\'
                    }
                }
            });

            // Mock login request
            mock.onPost(apiURL).reply(200, {
                login: {
                    result: 'Success',
                    lguserid: 12345,
                    lgusername: 'TestUser@BotName'
                }
            });

            await auth.ensureLoggedIn(site);

            expect(mock.history.get.length).toBe(1);
            expect(mock.history.post.length).toBe(1);
        });

        it('should not log in again if already logged in to site', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: {
                    tokens: {
                        logintoken: 'test-login-token+\\'
                    }
                }
            });

            // Mock login request
            mock.onPost(apiURL).reply(200, {
                login: {
                    result: 'Success',
                    lguserid: 12345,
                    lgusername: 'TestUser@BotName'
                }
            });

            await auth.ensureLoggedIn(site);
            await auth.ensureLoggedIn(site);

            // Should only make requests once
            expect(mock.history.get.length).toBe(1);
            expect(mock.history.post.length).toBe(1);
        });

        it('should throw NotLoggedInError if login token is not returned', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login token request with missing token
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: {
                    tokens: {}
                }
            });

            await expect(auth.ensureLoggedIn(site)).rejects.toThrow(NotLoggedInError);
            await expect(auth.ensureLoggedIn(site)).rejects.toThrow('Failed to obtain login token');
        });

        it('should throw PermissionDeniedError on login failure', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'wrongpassword',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: {
                    tokens: {
                        logintoken: 'test-login-token+\\'
                    }
                }
            });

            // Mock failed login request
            mock.onPost(apiURL).reply(200, {
                login: {
                    result: 'Failed',
                    reason: 'Wrong password'
                }
            });

            await expect(auth.ensureLoggedIn(site)).rejects.toThrow(PermissionDeniedError);
            await expect(auth.ensureLoggedIn(site)).rejects.toThrow('Login failed: Failed - Wrong password');
        });

        it('should throw PermissionDeniedError on login failure without reason', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'wrongpassword',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: {
                    tokens: {
                        logintoken: 'test-login-token+\\'
                    }
                }
            });

            // Mock failed login request without reason
            mock.onPost(apiURL).reply(200, {
                login: {
                    result: 'Failed'
                }
            });

            await expect(auth.ensureLoggedIn(site)).rejects.toThrow(PermissionDeniedError);
            await expect(auth.ensureLoggedIn(site)).rejects.toThrow('Login failed: Failed');
        });

        it('should handle different sites independently', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site1 = 'https://en.wikipedia.org';
            const site2 = 'https://www.wikidata.org';

            // Mock login for site1
            mock.onGet(new RegExp(`${site1}/w/api.php.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'token1+\\' } }
            });
            mock.onPost(`${site1}/w/api.php`).reply(200, {
                login: { result: 'Success', lguserid: 1, lgusername: 'TestUser@BotName' }
            });

            // Mock login for site2
            mock.onGet(new RegExp(`${site2}/w/api.php.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'token2+\\' } }
            });
            mock.onPost(`${site2}/w/api.php`).reply(200, {
                login: { result: 'Success', lguserid: 2, lgusername: 'TestUser@BotName' }
            });

            await auth.ensureLoggedIn(site1);
            await auth.ensureLoggedIn(site2);

            // Should make requests for both sites
            expect(mock.history.get.length).toBe(2);
            expect(mock.history.post.length).toBe(2);
        });
    });

    describe('getCsrfToken', () => {
        it('should get CSRF token after logging in', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });

            // Mock CSRF token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: {
                    tokens: {
                        csrftoken: 'test-csrf-token+\\'
                    }
                }
            });

            const token = await auth.getCsrfToken(site);

            expect(token).toBe('test-csrf-token+\\');
        });

        it('should cache CSRF token', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });

            // Mock CSRF token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: {
                    tokens: {
                        csrftoken: 'test-csrf-token+\\'
                    }
                }
            });

            const token1 = await auth.getCsrfToken(site);
            const token2 = await auth.getCsrfToken(site);

            expect(token1).toBe(token2);
            // Should only request CSRF token once (login token + csrf token)
            expect(mock.history.get.filter((request) => request.url?.includes('type=csrf')).length).toBe(1);
        });

        it('should throw NotLoggedInError if CSRF token is invalid', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });

            // Mock CSRF token request with invalid token
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: {
                    tokens: {
                        csrftoken: '+\\'
                    }
                }
            });

            await expect(auth.getCsrfToken(site)).rejects.toThrow(NotLoggedInError);
            await expect(auth.getCsrfToken(site)).rejects.toThrow(
                'Failed to obtain CSRF token - may not be logged in'
            );
        });

        it('should throw NotLoggedInError if CSRF token is missing', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });

            // Mock CSRF token request with missing token
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: {
                    tokens: {}
                }
            });

            await expect(auth.getCsrfToken(site)).rejects.toThrow(NotLoggedInError);
        });

        it('should log in automatically if not logged in', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });

            // Mock CSRF token request
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: {
                    tokens: {
                        csrftoken: 'test-csrf-token+\\'
                    }
                }
            });

            const token = await auth.getCsrfToken(site);

            expect(token).toBe('test-csrf-token+\\');
            expect(mock.history.post.length).toBe(1); // Login should have happened
        });
    });

    describe('clearCache', () => {
        it('should clear all cached data', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login and token requests
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: { tokens: { csrftoken: 'test-csrf-token+\\' } }
            });

            await auth.getCsrfToken(site);
            auth.clearCache();

            // After clearing cache, should need to log in again
            await auth.ensureLoggedIn(site);

            // Should have made login requests twice
            expect(mock.history.get.filter((request) => request.url?.includes('type=login')).length).toBe(2);
        });

        it('should clear CSRF token cache', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            // Mock login and token requests
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });
            mock.onPost(apiURL).reply(200, {
                login: { result: 'Success', lguserid: 12345, lgusername: 'TestUser@BotName' }
            });
            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=csrf`)).reply(200, {
                query: { tokens: { csrftoken: 'test-csrf-token+\\' } }
            });

            await auth.getCsrfToken(site);
            const csrfRequestsBefore = mock.history.get.filter((request) => request.url?.includes('type=csrf')).length;

            auth.clearCache();
            await auth.getCsrfToken(site);

            const csrfRequestsAfter = mock.history.get.filter((request) => request.url?.includes('type=csrf')).length;

            // Should have made CSRF token request twice (once before, once after clear)
            expect(csrfRequestsAfter).toBe(csrfRequestsBefore + 1);
        });
    });

    describe('getAxiosInstance', () => {
        it('should return axios instance', () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const instance = auth.getAxiosInstance();

            expect(instance).toBeDefined();
            expect(typeof instance.get).toBe('function');
            expect(typeof instance.post).toBe('function');
        });

        it('should have correct user agent configured', () => {
            const userAgent = 'TestBot/1.0 (https://example.com)';
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent
            });

            const instance = auth.getAxiosInstance();

            expect(instance.defaults.headers['User-Agent']).toBe(userAgent);
        });

        it('should have withCredentials enabled', () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const instance = auth.getAxiosInstance();

            expect(instance.defaults.withCredentials).toBe(true);
        });
    });

    describe('axios instance configuration', () => {
        it('should have timeout configured', () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const instance = auth.getAxiosInstance();

            expect(instance.defaults.timeout).toBe(30000);
        });

        it('should have interceptors configured', () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const instance = auth.getAxiosInstance();

            // Verify interceptors exist
            expect(instance.interceptors.request).toBeDefined();
            expect(instance.interceptors.response).toBeDefined();
        });
    });

    describe('error handling', () => {
        it('should handle network errors during login token request', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).networkError();

            await expect(auth.ensureLoggedIn(site)).rejects.toThrow();
        });

        it('should handle network errors during login request', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).reply(200, {
                query: { tokens: { logintoken: 'login-token+\\' } }
            });

            mock.onPost(apiURL).networkError();

            await expect(auth.ensureLoggedIn(site)).rejects.toThrow();
        });

        it('should handle timeout errors', async () => {
            const auth = new BotPasswordAuth({
                username: 'TestUser@BotName',
                password: 'botpassword123',
                userAgent: 'TestBot/1.0'
            });

            const site = 'https://en.wikipedia.org';
            const apiURL = `${site}/w/api.php`;

            mock.onGet(new RegExp(`${apiURL}.*action=query.*type=login`)).timeout();

            await expect(auth.ensureLoggedIn(site)).rejects.toThrow();
        });
    });
});
