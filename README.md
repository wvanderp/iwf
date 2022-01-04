Improved Wikidata Format
========================
[![codecov](https://codecov.io/gh/wvanderp/iwf/branch/main/graph/badge.svg?token=6CPZPAOAUP)](https://codecov.io/gh/wvanderp/iwf)

A better way of working with the wikidata

# Features
- work with wikidata using classes
- request items from wikidata
- upload the changes

# Getting Started

```bash
npm i --save iwf
```

you can easily request an item from wikidata and list all the labels.
```typescript
import {requestItem} from 'iwf';

const item = requestItem('Q42');

console.log(item.labels);
```

Or create a new item and upload it to wikidata.
```typescript
import { Item, getToken, upload, Label, Statement, WikibaseItemSnak } from 'iwf';

const item = Item.fromNothing();

item.labels.push(Label.fromString('en', 'new planet '));
item.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P31', 'Q634')));

const token = await getToken('your wikidata username', 'your wikidata password');

upload(item, {
    summary: 'test update',
    authToken: token
});
```

# Documentation
To see all the functionality, extra documentation and examples, visit [the documentation](https://wvanderp.github.io/iwf/)

## License

[MIT](LICENSE)