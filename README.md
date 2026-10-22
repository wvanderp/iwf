# Improved Wikidata Format

[![Test](https://github.com/wvanderp/iwf/actions/workflows/test.yml/badge.svg)](https://github.com/wvanderp/iwf/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/dm/iwf)](https://www.npmjs.com/package/iwf)
[![codecov](https://codecov.io/gh/wvanderp/iwf/branch/main/graph/badge.svg?token=6CPZPAOAUP)](https://codecov.io/gh/wvanderp/iwf)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwvanderp%2Fiwf.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fwvanderp%2Fiwf?ref=badge_shield)

A TypeScript library that simplifies working with Wikidata through an intuitive object-oriented interface.
Wikidata is a free knowledge base that anyone can edit, serving as a central storage for structured data used by Wikipedia and other Wikimedia projects.

## Features

- Request and parse Wikidata items
- Object-oriented interface for working with Wikidata entities
- Full TypeScript support with comprehensive type definitions
- Upload changes back to Wikidata with automatic diff generation
- Handle labels, descriptions, aliases, statements, and sitelinks
- Support for both anonymous and authenticated operations

## Requirements

- Node.js 22.18.0 or higher
- For browser usage: Modern browsers supporting ES2020+
- For authenticated operations: A Wikidata account

## Installation

```bash
pnpm add iwf
```

You can easily request an item from Wikidata and list all the labels. For example, Q42 represents Douglas Adams in Wikidata:

```typescript
import { requestItem } from 'iwf';

// Request the item for Douglas Adams (Q42)
const item = await requestItem('Q42', { userAgent: 'YourApp/1.0' });

// Prints all available labels in different languages
console.log(item.labels);
```

Create a new item and upload it to Wikidata. This example creates a new astronomical object:

```typescript
import { Item, BotPasswordAuth, upload, Label, Statement, WikibaseItemSnak } from 'iwf';

const item = Item.fromNothing();

// Add an English label
item.labels.push(Label.fromString('en', 'new planet'));

// Add a statement: instance of (P31) celestial body (Q634)
item.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P31', 'Q634')));

// Authenticate with bot password and upload
const auth = new BotPasswordAuth({
    username: 'YourUsername@YourBotName',
    password: 'your-bot-password',
    userAgent: 'YourApp/1.0 (your@email.com)'
});

await upload(item, {
    summary: 'Adding new astronomical object',
    auth
});
```

## Authentication

The library supports bot passwords, browser OAuth 2.0 with PKCE (`OAuthAuth`), and already-issued OAuth 2.0 bearer tokens (`BearerTokenAuth`). All implement the public `AuthProvider` interface accepted by `upload()`.

### Bot passwords

Bot passwords are app-specific passwords that can be created in your Wikidata account settings. Use the account and bot name together as `YourUsername@YourBotName`.

```typescript
import { Item, BotPasswordAuth, Label, Statement, WikibaseItemSnak } from 'iwf';

// Create auth provider
const auth = new BotPasswordAuth({
    username: 'YourUsername@YourBotName',
    password: 'your-bot-password',
    userAgent: 'YourApp/1.0 (your@email.com)'
});

// Create and modify item
const item = Item.fromNothing();
item.labels.push(Label.fromString('en', 'new planet'));
item.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P31', 'Q634')));

// Get CSRF token for API calls
const csrfToken = await auth.getCsrfToken('https://www.wikidata.org');
```

### Server-side OAuth access tokens

Use `BearerTokenAuth` in a TypeScript/Node server when Wikimedia has already issued your application an access token. No browser, redirect, PKCE, or session storage is required.

```typescript
import { BearerTokenAuth, requestItem, upload } from 'iwf';

const auth = new BearerTokenAuth({
    accessToken: process.env.WIKIDATA_ACCESS_TOKEN!,
    userAgent: 'wikidata-bench-editor/1.0',
});

const item = await requestItem('Q42', {
    userAgent: auth.getUserAgent(),
});
// Review and modify this item before saving. Keep its original lastrevid.
if (item.lastrevid === undefined) {
    throw new Error('A reviewed revision is required before saving.');
}

await upload(item, {
    auth,
    summary: 'Reviewed Wikidata suggestions',
    baseRevisionId: item.lastrevid,
    assert: 'user',
    maxLag: 5,
});
```

The provider adds `Authorization: Bearer ...` and the configured User-Agent to its HTTP client. It retrieves CSRF tokens with `assert=user`, rejects missing or anonymous tokens, and caches authenticated CSRF tokens per site origin. Use its client only with trusted Wikimedia/Wikibase endpoints. Keep the access token on your server.

#### Expiry and replacement

Optionally pass `expiresAt` as Unix epoch **seconds**. The provider rejects the token **60 seconds before expiry**, checking before every authenticated request and before using a cached CSRF token. Tokens without an expiry remain usable until the API rejects them; JWT claims are not decoded or verified locally.

No refresh is attempted. Create a new provider with a replacement access token after `AuthExpiredError`. A token rejected by the API remains rejected for the lifetime of its provider.

#### Bearer errors and CSRF recovery

- HTTP 401 and the API codes `invalid_token` and `mwoauth-invalid-authorization` throw `AuthExpiredError` and invalidate the access token.
- Session assertion failures such as `assertuserfailed` throw `NotLoggedInError`; they do not permanently invalidate the access token.
- HTTP 403 throws `PermissionDeniedError`. Other HTTP failures throw `NetworkError`.
- A `badtoken` response throws `PermissionDeniedError` and clears the bearer provider's cached CSRF token for that site. The next explicit upload or `getCsrfToken()` call fetches a fresh CSRF token. IWF does not retry the failed write automatically.

Bearer errors omit raw Axios configs, responses, and causes to protect credentials. API errors use fixed messages and omit raw API descriptions and details.

## Upload options and errors

`AuthProvider` and `UploadOptions` are exported for custom providers and typed integrations. Existing upload calls can omit `baseRevisionId` and `assert`.

### Reviewed revisions: `baseRevisionId`

`baseRevisionId` is optional for existing items and is sent unchanged as `baserevid`. New items have no revision to review: supplying `baseRevisionId` for an item without an ID throws `TypeError` before any network request.

IWF fetches the existing item to detect removals and rejects the upload if its revision differs from `baseRevisionId`. Preserve the revision you reviewed, rather than replacing it with a revision fetched just before saving.

For changes between that read and the write, IWF relies on Wikibase's conflict handling. Wikibase can merge some concurrent changes, so this is not an atomic “reject every stale revision” guarantee. See the [Wikibase conflict reference](https://doc.wikimedia.org/Wikibase/master/php/interfaceWikibase_1_1Repo_1_1EditEntity_1_1EditEntity.html).

Both preflight conflicts and API `editconflict` responses expose `APIError.apiCode === 'editconflict'`, regardless of authentication provider. Conflicts are not retried; fetch and review the item again.

### Session assertions: `assert`

The optional [`assert`](https://www.mediawiki.org/wiki/API:Assert) option accepts `'user'` or `'bot'` with an authenticated provider, or `'anon'` with `anonymous: true`. Authentication and anonymous mode are mutually exclusive. Contradictory options are rejected by TypeScript and at runtime for JavaScript callers.

### Consistent API errors

Uploads with bearer tokens, bot passwords, browser OAuth, and anonymous sessions map API error codes to the same exported error types. For example, `assertuserfailed` produces `NotLoggedInError`, `badtoken` produces `PermissionDeniedError`, and `maxlag` produces `RateLimitedError`. Unknown API codes produce `APIError` with the original code in `apiCode`; mapped errors retain it in `details.apiCode`.

API error messages are fixed and do not include the API's raw `info` or response details. Missing or malformed unsuccessful responses throw `APIError`. Bearer access-token rejection follows the additional `AuthExpiredError` rules above.

## Documentation

To see all the functionality, extra documentation, and examples, visit [the documentation](https://wvanderp.github.io/iwf/).

## Where can you help?

You are already helping by using this library, but if you want to do more, there are a few things you can do:

- If you find a bug, please report it here on GitHub.
- If you have an idea for a new feature, please create an issue here on GitHub.
- If you want to help with the development, you can fork this repository and create a pull request.

There is a [FUTURE.md](FUTURE.md) file that contains ideas for future development. If you want to help, you can look there for ideas.

## License

[MIT](LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwvanderp%2Fiwf.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fwvanderp%2Fiwf?ref=badge_large)
