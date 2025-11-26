/* eslint-disable no-console, require-jsdoc, no-process-exit */
/**
 * Small example demonstrating how to log in a bot using BotPasswordAuth
 *
 * Usage:
 *  - Set environment variables: BOT_USERNAME, BOT_PASSWORD, SITE_URL, USER_AGENT
 *  - Run with ts-node or compile with tsc and run with node
 *
 * This file intentionally keeps credentials out of source control. Replace the
 * placeholders or use an env-file when running locally.
 */

import BotPasswordAuth from '../src/auth/BotPasswordAuth';

async function main(): Promise<void> {
    const username = process.env.BOT_USERNAME || '';
    const password = process.env.BOT_PASSWORD || '';
    const site = process.env.SITE_URL || 'https://www.wikidata.org';
    const userAgent = process.env.USER_AGENT || 'iwf-bot-example/0.1 (example.org)';

    if (!username || !password) {
        console.error(
            'Please set BOT_USERNAME and BOT_PASSWORD environment variables before running this example.'
        );
        console.error('Example values: MainAccount@BotName and a bot password');
        process.exit(1);
    }

    const auth = new BotPasswordAuth({ username, password, userAgent });

    try {
        console.log(`Logging in to ${site} as ${username}...`);
        await auth.ensureLoggedIn(site);
        console.log('Login successful.');

        const csrf = await auth.getCsrfToken(site);
        console.log('Obtained CSRF token:', csrf ? '[redacted]' : '(none)');

        // Use the axios instance attached to the auth provider to make an API call
        const axios = auth.getAxiosInstance();
        const apiURL = `${new URL(site).origin}/w/api.php`;

        // Fetch basic userinfo to confirm current user
        const resp = await axios.get(apiURL, {
            params: {
                action: 'query',
                meta: 'userinfo',
                format: 'json'
            }
        });

        console.log('API response (userinfo):', JSON.stringify(resp.data, null, 2));
    } catch (err: unknown) {
        // If the provider exposes an onAuthError hook, call it to allow recovery
        // (BotPasswordAuth implements a no-op onAuthError we can call safely)
        if ((typeof auth.onAuthError) === 'function') {
            try {
                await auth.onAuthError(err as Error);
            } catch (cleanupErr) {
                // ignore
            }
        }

        console.error('Login or API request failed:', err);
        process.exitCode = 2;
    }
}

// Only run main when executed directly (so this module can be imported safely)
if (require.main === module) {
    main().catch((e) => {
        console.error('Unhandled error in example:', e);
        process.exit(1);
    });
}
