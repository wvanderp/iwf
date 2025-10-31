# Authentication Guide

iwf now supports modern authentication methods for interacting with MediaWiki APIs, including OAuth 2.0 and Bot Passwords.

## Overview

The authentication system provides:

- **OAuth 2.0 Authorization Code with PKCE**: For user-context edits with interactive authorization and refresh tokens
- **Bot Passwords**: For simple, non-interactive bot operations via Action API
- **Automatic Token Management**: Access token caching, refresh, and expiry handling
- **Retry Logic**: Exponential backoff for rate limits and server errors
- **Error Handling**: Comprehensive error taxonomy for better debugging

## Quick Start

### OAuth 2.0 (Recommended for Production)

OAuth 2.0 is the recommended authentication method for production applications. It provides secure, token-based authentication with automatic refresh.

#### Interactive Setup (One-time)

```typescript
import { OAuth2AuthCode, FileTokenStore } from 'iwf';

// Initialize OAuth provider
const auth = new OAuth2AuthCode({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret', // Optional for public clients
    userAgent: 'YourApp/1.0 (your@email.com)',
    scopes: ['editpage', 'createeditmovepage'], // Optional, these are defaults
    tokenStore: new FileTokenStore() // Optional, stores tokens in .iwf/tokens.json
});

// Begin interactive authorization
const callbackUrl = 'http://localhost:3000/callback';
const { authorizeUrl, pkceParams } = auth.beginInteractiveAuth(callbackUrl);

console.log('Open this URL in your browser:', authorizeUrl);
// User authorizes and is redirected to callback URL with ?code=...

// Complete authorization with the code
await auth.completeInteractiveAuth(code, pkceParams.codeVerifier, callbackUrl);
// Refresh token is now stored and can be used for subsequent runs
```

#### Headless Usage (CI/Production)

Once you have a stored refresh token, you can use it for automated operations:

```typescript
import { OAuth2AuthCode } from 'iwf';

const auth = new OAuth2AuthCode({
    clientId: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    userAgent: 'YourApp/1.0 (your@email.com)',
});

// Initialize from stored refresh token
await auth.initializeFromRefreshToken();

// Now you can use auth for operations (see "Using Authentication" below)
```

### Bot Passwords (Simple Alternative)

Bot Passwords are simpler but less secure than OAuth. Use them for simple bots or development.

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

### With Upload Operations

The auth system is designed to work with iwf's upload and edit operations:

```typescript
import { OAuth2AuthCode, requestItem, upload } from 'iwf';

// Setup auth (see above)
const auth = new OAuth2AuthCode({ /* config */ });
await auth.initializeFromRefreshToken();

// Fetch and modify an item
const item = await requestItem('Q42');
// ... modify item ...

// Upload with authentication
// TODO: This API is not yet implemented in the current version
// The upload function will be updated to accept auth parameter
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

## Token Storage

### File-based Storage (Default)

The `FileTokenStore` saves refresh tokens to a local file:

```typescript
import { FileTokenStore } from 'iwf';

const store = new FileTokenStore('.iwf', 'tokens.json');
// Stores tokens in ./.iwf/tokens.json with restrictive permissions (0600)
```

**Security**: The token file is created with owner-only read/write permissions (0600) to protect your credentials.

### Memory Storage (Testing)

For testing or temporary use:

```typescript
import { MemoryTokenStore } from 'iwf';

const store = new MemoryTokenStore();
// Tokens are lost when process exits
```

### Custom Storage

Implement your own storage by implementing the `TokenStore` interface:

```typescript
import { TokenStore } from 'iwf';

class MyCustomStore implements TokenStore {
    async loadRefreshToken(key?: string): Promise<string | undefined> {
        // Load from your storage (database, cloud, etc.)
    }
    
    async saveRefreshToken(value: string, key?: string): Promise<void> {
        // Save to your storage
    }
}
```

## Error Handling

The auth system provides a comprehensive error taxonomy:

```typescript
import {
    AuthExpiredError,
    NotLoggedInError,
    PermissionDeniedError,
    RateLimitedError,
    AbuseFilterError,
    SpamBlacklistError,
    CaptchaNeededError,
    NetworkError,
    APIError
} from 'iwf';

try {
    // ... your operations ...
} catch (error) {
    if (error instanceof RateLimitedError) {
        console.log(`Rate limited, retry after ${error.retryAfter} seconds`);
    } else if (error instanceof AuthExpiredError) {
        console.log('Token expired, re-authenticating...');
        await auth.onAuthError(error);
    } else if (error instanceof PermissionDeniedError) {
        console.log('Insufficient permissions:', error.message);
    }
}
```

## Configuration

### Environment Variables

For security, store sensitive values in environment variables:

```bash
# OAuth
export OAUTH_CLIENT_ID="your-client-id"
export OAUTH_CLIENT_SECRET="your-client-secret"

# Bot Password
export BOT_USERNAME="YourUsername@YourBotName"
export BOT_PASSWORD="your-bot-password"
```

Then use them in your code:

```typescript
const auth = new OAuth2AuthCode({
    clientId: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
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
2. **Use OAuth 2.0 for production**: More secure than Bot Passwords
3. **Rotate secrets regularly**: Especially bot passwords
4. **Restrict token file permissions**: FileTokenStore automatically uses 0600
5. **Use minimal scopes**: Only request OAuth scopes you actually need
6. **Implement proper error handling**: Don't expose credentials in logs

## OAuth Scopes

Common OAuth scopes for Wikimedia wikis:

- `editpage`: Edit existing pages
- `createeditmovepage`: Create, edit, and move pages
- `delete`: Delete pages
- `upload`: Upload files
- `patrol`: Mark edits as patrolled

Specify scopes when creating the OAuth provider:

```typescript
const auth = new OAuth2AuthCode({
    // ... other config ...
    scopes: ['editpage', 'createeditmovepage', 'upload']
});
```

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

## Registering OAuth Clients

To use OAuth 2.0, you need to register an OAuth client:

1. Visit https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose/oauth2
2. Fill in application details:
   - Application name
   - Application description
   - OAuth callback URL (e.g., `http://localhost:3000/callback` for development)
   - Grants (scopes) needed
3. Submit and note your Client ID and Client Secret

## Troubleshooting

### "No stored refresh token found"

Make sure you've completed the interactive auth flow at least once, or that your token file exists and is readable.

### "Login failed: Aborted"

For bot passwords, ensure:
- Username is in format `MainAccount@BotName`
- Password is the bot password, not your account password
- Bot password has the correct grants enabled

### "Failed to refresh access token"

Your refresh token may be expired or revoked. Re-run the interactive auth flow to get a new refresh token.

### "Rate limited"

You're making requests too quickly. The library will automatically retry with backoff, but consider reducing your request frequency.

## Migration from Old API

**Breaking Change**: The old `getToken(username, password)` function is deprecated and will be removed in a future version.

Old code:
```typescript
const token = await getToken('username', 'password');
await upload(item, { summary: 'Edit', authToken: token });
```

New code (Bot Password):
```typescript
const auth = new BotPasswordAuth({
    username: 'Username@BotName',
    password: 'bot-password',
    userAgent: 'MyApp/1.0'
});
// TODO: upload API not yet updated
```

New code (OAuth):
```typescript
const auth = new OAuth2AuthCode({ /* config */ });
await auth.initializeFromRefreshToken();
// TODO: upload API not yet updated
```

## Additional Resources

- [MediaWiki OAuth 2.0 Documentation](https://www.mediawiki.org/wiki/OAuth/For_Developers)
- [MediaWiki Bot Passwords](https://www.mediawiki.org/wiki/Manual:Bot_passwords)
- [Wikidata Bot Policy](https://www.wikidata.org/wiki/Wikidata:Bots)
- [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)
