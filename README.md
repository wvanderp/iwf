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

- Node.js 16 or higher
- For browser usage: Modern browsers supporting ES2020+
- For authenticated operations: A Wikidata account

## Installation

```bash
npm i --save iwf
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

The library supports Bot Password authentication for editing operations. Bot passwords are app-specific passwords that can be created in your Wikidata account settings.

Example with Bot Password:

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
