# Authentication Guide

iwf supports Bot Password authentication for interacting with MediaWiki APIs.

## Overview

The authentication system provides:

- **Bot Passwords**: Simple, non-interactive bot operations via Action API
- **Automatic Token Management**: CSRF token caching and session management
- **Retry Logic**: Exponential backoff for rate limits and server errors
- **Error Handling**: Comprehensive error taxonomy for better debugging

## Quick Start

### Bot Passwords

Bot Passwords are the recommended authentication method for bots and automated scripts.

**Security Note**: Bot Passwords should only be used with dedicated bot accounts, never with your main account password.

```typescript
import { BotPasswordAuth } from 'iwf';

const auth = new BotPasswordAuth({
    username: 'YourUsername@YourBotName', // Format: MainAccount@BotName
    password: 'your-bot-password', // Bot password, NOT main account password
    userAgent: 'YourApp/1.0 (your@email.com)'
});

// No initialization needed, auth will login automatically when first used
```

## Using Authentication

### Getting CSRF Tokens

You can use the auth provider to get CSRF tokens for write operations:

```typescript
// Get CSRF token for write operations
const csrfToken = await auth.getCsrfToken('https://www.wikidata.org');
```

### Manual API Calls

You can use the auth providers directly for custom API calls:

```typescript
import axios from 'axios';

// Get CSRF token for write operations
const csrfToken = await auth.getCsrfToken('https://www.wikidata.org');

// Authorize a request
const requestConfig = await auth.authorize({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// Make authenticated API call
const response = await axios.post(
    'https://www.wikidata.org/w/api.php',
    /* your data */,
    requestConfig
);
```

## Error Handling

The auth system provides a comprehensive error taxonomy:

```typescript
import {
    NotLoggedInError,
    PermissionDeniedError,
    RateLimitedError,
    AbuseFilterError,
    SpamBlocklistError,
    CaptchaNeededError,
    NetworkError,
    APIError
} from 'iwf';

try {
    // ... your operations ...
} catch (error) {
    if (error instanceof RateLimitedError) {
        console.log(\`Rate limited, retry after \${error.retryAfter} seconds\`);
    } else if (error instanceof PermissionDeniedError) {
        console.log('Insufficient permissions:', error.message);
    } else if (error instanceof NotLoggedInError) {
        console.log('Not logged in:', error.message);
        await auth.onAuthError(error);
    }
}
```

## Configuration

### Environment Variables

For security, store sensitive values in environment variables:

```bash
# Bot Password
export BOT_USERNAME="YourUsername@YourBotName"
export BOT_PASSWORD="your-bot-password"
```

Then use them in your code:

```typescript
const auth = new BotPasswordAuth({
    username: process.env.BOT_USERNAME!,
    password: process.env.BOT_PASSWORD!,
    userAgent: 'YourApp/1.0'
});
```

### Timeouts and Retries

The axios instances created by the auth system include automatic retry logic:

- **429 (Rate Limited)**: Automatic exponential backoff with Retry-After header support
- **5xx (Server Errors)**: Automatic retry with exponential backoff
- **Default timeout**: 30 seconds
- **Max retries**: 3 attempts
- **Base delay**: 1 second (exponentially increases)

## Security Best Practices

1. **Never commit credentials**: Use environment variables or secure vaults
2. **Use dedicated bot accounts**: Don't use your main account password
3. **Rotate secrets regularly**: Change bot passwords periodically
4. **Implement proper error handling**: Don't expose credentials in logs

## Creating Bot Passwords

To create a bot password:

1. Go to your wiki's Special:BotPasswords page (e.g., \`https://www.wikidata.org/wiki/Special:BotPasswords\`)
2. Create a new bot password with a descriptive name
3. Select the required grants (permissions) for your bot
4. Save and securely store the generated password

## Rate Limiting and Etiquette

When using the API:

1. **Respect rate limits**: The library automatically handles 429 responses
2. **Use a descriptive User-Agent**: Required and helps wiki admins contact you
3. **Batch operations**: When possible, batch multiple edits together
4. **Monitor your usage**: Be aware of your edit frequency
5. **Follow bot policies**: Each wiki has its own bot policy

Example User-Agent:

```
YourBotName/1.0 (https://example.com/bot-info; contact@example.com) iwf/0.1.1
```

## Troubleshooting

### "Login failed: Aborted"

For bot passwords, ensure:

- Username is in format \`MainAccount@BotName\`
- Password is the bot password, not your account password
- Bot password has the correct grants enabled

### "Failed to obtain CSRF token"

This usually means:

- The bot is not properly logged in
- The session has expired
- The bot password doesn't have the required grants

### "Rate limited"

You're making requests too quickly. The library will automatically retry with backoff, but consider reducing your request frequency.

## Additional Resources

- [MediaWiki Bot Passwords](https://www.mediawiki.org/wiki/Manual:Bot_passwords)
- [Wikidata Bot Policy](https://www.wikidata.org/wiki/Wikidata:Bots)
- [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)
