import fs from 'fs';
import path from 'path';

import {
    Alias,
    Description,
    Item, Label, SiteLink, Statement, WikibaseItemSnak,
    URLSnak
} from '../../src';

const testFiles = fs.readdirSync(path.resolve(__dirname, './data/'));

describe('load data into the model', () => {
    for (const file of testFiles) {
        it(`should return the same contents with as was ingested from ${file}`, () => {
            const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${file}`)).toString('utf8'));
            const wikidataJSON = contents.entities[Object.keys(contents.entities)[0]];
            const item = new Item(wikidataJSON);

            expect(item.toJSON()).toStrictEqual(wikidataJSON);
        });
    }
});

describe('constructor', () => {
    it('should throw an error the id of the item is a string but not a QString', () => {
        const item = Item.fromNothing();
        const json = item.toJSON();
        json.id = 'string';

        expect(() => new Item(json)).toThrow();
    });

    it('should throw an error the id of the item is no string at all', () => {
        const item = Item.fromNothing();
        const json = item.toJSON();
        // @ts-expect-error it is for the test
        json.id = 11;

        expect(() => new Item(json)).toThrow();
    });

    it('should NOT throw an error the id of the item is a QString', () => {
        const item = Item.fromNothing();
        const json = item.toJSON();
        json.id = 'Q11';

        expect(() => new Item(json)).not.toThrow();
    });
});

describe('internalID', () => {
    it('should be the hash of the json', () => {
        const item = Item.fromNothing();
        expect(item.internalID).toEqual('56930c1612485547e470e865fd3480c567ac570d5ac7e52aeaf6927be51b02a6');
    });

    it('should not change when the item changes', () => {
        const item = Item.fromNothing();
        const internalId = item.internalID;
        item.aliases.push(Alias.fromString('en', 'foo'));
        expect(item.internalID).toEqual(internalId);
    });
});

describe('getLabel', () => {
    it('should find a label if it is present', () => {
        const item = Item.fromNothing();
        item.labels.push(Label.fromString('en', 'Jesus'));

        const findLabel = item.findLabel('en');

        expect(findLabel?.language).toEqual('en');
        expect(findLabel?.value).toEqual('Jesus');
    });

    it('should find a label if it is present but an other is', () => {
        const item = Item.fromNothing();
        item.labels.push(Label.fromString('en', 'Jesus'));

        const findLabel = item.findLabel('fr');

        expect(findLabel).toEqual(undefined);
    });

    it('should find a label if it is not present', () => {
        const item = Item.fromNothing();

        const findLabel = item.findLabel('en');

        expect(findLabel).toEqual(undefined);
    });

    it('should find a label if the selected language is not present but the Multiple language is', () => {
        const item = Item.fromNothing();
        item.labels.push(Label.fromString('mul', 'Jesus'));

        const findLabel = item.findLabel('en');

        expect(findLabel?.language).toEqual('mul');
        expect(findLabel?.value).toEqual('Jesus');
    });
});

describe('addStatement', () => {
    it('should add a statement', () => {
        const item = Item.fromNothing();
        item.addStatement(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')));

        expect(item.statements.length).toEqual(1);
        expect(item.statements[0].equals(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')))).toBe(true);
    });

    it('should add an array of statements', () => {
        const item = Item.fromNothing();
        item.addStatement([
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q12')),
        ]);

        expect(item.statements.length).toEqual(2);
        expect(item.statements[0].equals(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')))).toBe(true);
        expect(item.statements[1].equals(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q12')))).toBe(true);
    });
});

// used for both removeStatement and removeStatements
let item = Item.fromNothing();
let statement1 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.wikidata.org/'));
let statement2 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://en.wikipedia.org/'));
let statement3 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://nl.wikipedia.org/'));

describe('removeStatement', () => {
    beforeEach(() => {
        item = Item.fromNothing();
        statement1 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.wikidata.org/'));
        statement2 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://en.wikipedia.org/'));
        statement3 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://nl.wikipedia.org/'));

        item.statements.push(statement1, statement2, statement3);
    });

    it('should remove a statement if it is present', () => {
        item.removeStatement(statement2);

        expect(item.statements.length).toEqual(2);
        expect(item.statements[0].equals(statement1)).toBe(true);
        expect(item.statements[1].equals(statement3)).toBe(true);
    });

    it('should not remove a statement if it is not present', () => {
        item.removeStatement(Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.google.com/')));

        expect(item.statements.length).toEqual(3);
        expect(item.statements[0].equals(statement1)).toBe(true);
        expect(item.statements[1].equals(statement2)).toBe(true);
        expect(item.statements[2].equals(statement3)).toBe(true);
    });
});

describe('removeStatements', () => {
    beforeEach(() => {
        item = Item.fromNothing();
        statement1 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.wikidata.org/'));
        statement2 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://en.wikipedia.org/'));
        statement3 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://nl.wikipedia.org/'));
        item.statements.push(statement1, statement2, statement3);
    });

    it('should remove a array of statements if they are present', () => {
        item.removeStatements([statement1, statement3]);

        expect(item.statements.length).toEqual(1);
        expect(item.statements[0].equals(statement2)).toBe(true);
    });

    it('should not remove a array of statements if they are not present', () => {
        item.removeStatements([
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.google.com/')),
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.twitter.com/')),
        ]);

        expect(item.statements.length).toEqual(3);
        expect(item.statements[0].equals(statement1)).toBe(true);
        expect(item.statements[1].equals(statement2)).toBe(true);
        expect(item.statements[2].equals(statement3)).toBe(true);
    });

    it('should remove some of the statements if some are present', () => {
        item.removeStatements([
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.google.com/')),
            statement1,
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.twitter.com/')),
            statement3,
        ]);

        expect(item.statements.length).toEqual(1);
        expect(item.statements[0].equals(statement2)).toBe(true);
    });
});

describe('equals', () => {
    it('two different items should not be equal', () => {
        const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[0]}`)).toString('utf8'));
        const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
        const item1 = new Item(wikidataJSON1);

        const contents2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[2]}`)).toString('utf8'));
        const wikidataJSON2 = contents2.entities[Object.keys(contents2.entities)[0]];
        const item2 = new Item(wikidataJSON2);

        expect(item1.equals(item2)).toBe(false);
    });

    it('two of the same item should be equal', () => {
        const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[0]}`)).toString('utf8'));
        const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
        const item1 = new Item(wikidataJSON1);

        expect(item1.equals(item1)).toBe(true);
    });

    it('two empty items should be equal', () => {
        const item1 = Item.fromNothing();
        const item2 = Item.fromNothing();

        expect(item1.equals(item2)).toBe(true);
    });

    it('two items should be equal with different statements should not be equal', () => {
        const item1 = Item.fromNothing();
        item1.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));

        const item2 = Item.fromNothing();
        item2.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2')));

        expect(item1.equals(item2)).toBe(false);
    });

    it('two items should be equal with the same statements should be equal', () => {
        const item1 = Item.fromNothing();
        item1.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));
        const item2 = Item.fromNothing();
        item2.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));

        expect(item1.equals(item2)).toBe(true);
    });
});

describe('diff', () => {
    it('should find the differences between two different items', () => {
        const item1 = Item.fromNothing();
        const item2 = Item.fromNothing();

        item1.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));
        item2.statements.push(
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q1')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P3', 'Q1'))
        );

        item1.labels.push(Label.fromString('en', 'Jesus'));
        item2.labels.push(Label.fromString('en', 'Jesus'));

        item1.labels.push(Label.fromString('de', 'Jesus'));
        item2.labels.push(Label.fromString('fr', 'Jesus'));

        item1.labels.push(Label.fromString('nl', 'Jesus'));
        item2.labels.push(Label.fromString('nl', 'de zoon van god'));

        const diff = item1.diff(item2);
        expect(diff).toStrictEqual([
            {
                type: 'label',
                action: 'remove',
                parentID: 'unknown',
                old: {
                    language: 'de',
                    value: 'Jesus'
                }
            },
            {
                type: 'label',
                action: 'update',
                parentID: 'unknown',
                old: {
                    language: 'nl',
                    value: 'Jesus'
                },
                new: {
                    language: 'nl',
                    value: 'de zoon van god'
                }
            },
            {
                type: 'label',
                action: 'add',
                parentID: 'unknown',
                new: {
                    language: 'fr',
                    value: 'Jesus'
                }
            },
            {
                action: 'add',
                parentID: 'unknown',
                type: 'statement',
                new: {
                    mainsnak: {
                        snaktype: 'value',
                        property: 'P2',
                        datavalue: {
                            value: {
                                'entity-type': 'item',
                                'numeric-id': 1,
                                id: 'Q1'
                            },
                            type: 'wikibase-entityid'
                        },
                        datatype: 'wikibase-item'
                    },
                    type: 'statement',
                    rank: 'normal'
                }
            },
            {
                action: 'add',
                parentID: 'unknown',
                type: 'statement',
                new: {
                    mainsnak: {
                        snaktype: 'value',
                        property: 'P3',
                        datavalue: {
                            value: {
                                'entity-type': 'item',
                                'numeric-id': 1,
                                id: 'Q1'
                            },
                            type: 'wikibase-entityid'
                        },
                        datatype: 'wikibase-item'
                    },
                    type: 'statement',
                    rank: 'normal'
                }
            },
            {
                action: 'remove',
                parentID: 'unknown',
                type: 'statement',
                old: {
                    mainsnak: {
                        snaktype: 'value',
                        property: 'P1',
                        datavalue: {
                            value: {
                                'entity-type': 'item',
                                'numeric-id': 1,
                                id: 'Q1'
                            },
                            type: 'wikibase-entityid'
                        },
                        datatype: 'wikibase-item'
                    },
                    type: 'statement',
                    rank: 'normal'
                }
            }
        ]);
    });

    it('should not find differences when there aren\'t any', () => {
        const item1 = Item.fromNothing();
        item1.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));
        item1.labels.push(Label.fromString('en', 'Jesus'));
        item1.descriptions.push(Description.fromString('en', 'the son of god'));
        item1.sitelinks.push(SiteLink.fromString('enwiki', 'Jesus'));
        item1.aliases.push(Alias.fromString('en', 'Jesus'));

        const item2 = Item.fromNothing();
        item2.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));
        item2.labels.push(Label.fromString('en', 'Jesus'));
        item2.descriptions.push(Description.fromString('en', 'the son of god'));
        item2.sitelinks.push(SiteLink.fromString('enwiki', 'Jesus'));
        item2.aliases.push(Alias.fromString('en', 'Jesus'));

        const diff = item1.diff(item2);

        expect(diff).toStrictEqual([]);
    });
});

describe('Edge cases according to O1', () => {
    it('should handle an item with an empty string label', () => {
        const item1 = Item.fromNothing();
        item1.labels.push(Label.fromString('en', ''));
        expect(item1.findLabel('en')?.value).toEqual('');
    });

    it('should handle removing a statement from an item that has no statements', () => {
        const item1 = Item.fromNothing();
        expect(() => item1.removeStatement(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')))).not.toThrow();
    });

    it('should handle adding multiple identical statements', () => {
        const item1 = Item.fromNothing();
        const s1 = Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1'));
        item1.addStatement(s1);
        item1.addStatement(s1);
        expect(item1.statements.length).toBe(2);
    });

    it('should consider items with statements in different order as equal if statements are the same', () => {
        const item1 = Item.fromNothing();
        const item2 = Item.fromNothing();
        const s1 = Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1'));
        const s2 = Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2'));

        item1.addStatement([s1, s2]);
        item2.addStatement([s2, s1]);

        expect(item1.equals(item2)).toBe(false);
    });
});
