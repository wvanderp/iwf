import fs from 'fs';
import path from 'path';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
    Alias,
    Description,
    Item, Label, SiteLink, Statement, WikibaseItemSnak,
    URLSnak
} from '../src';

const testFiles = fs.readdirSync(path.resolve(__dirname, './data/'));

describe('load data into the model', () => {
    for (const file of testFiles) {
        it(`should return the same contents with as was ingested from ${file}`, function () {
            const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${file}`)).toString('utf8'));
            const wikidataJSON = contents.entities[Object.keys(contents.entities)[0]];
            const item = new Item(wikidataJSON);

            expect(item.toJSON()).to.deep.equal(wikidataJSON);
        });
    }
});

describe('constructor', () => {
    it('should throw an error the id of the item is a string but not a QString', () => {
        const item = Item.fromNothing();
        const json = item.toJSON();
        json.id = 'string';

        expect(() => new Item(json)).to.throw();
    });

    it('should throw an error the id of the item is no string at all', () => {
        const item = Item.fromNothing();
        const json = item.toJSON();
        // @ts-expect-error it is for the test
        json.id = 11;

        expect(() => new Item(json)).to.throw();
    });

    it('should NOT throw an error the id of the item is a QString', () => {
        const item = Item.fromNothing();
        const json = item.toJSON();
        json.id = 'Q11';

        expect(() => new Item(json)).to.not.throw();
    });
});

describe('internalID', () => {
    it('should be the hash of the json', () => {
        const item = Item.fromNothing();
        expect(item.internalID).to.equal('56930c1612485547e470e865fd3480c567ac570d5ac7e52aeaf6927be51b02a6');
    });

    it('should not change when the item changes', () => {
        const item = Item.fromNothing();
        const internalId = item.internalID;
        item.aliases.push(Alias.fromString('en', 'foo'));
        expect(item.internalID).to.equal(internalId);
    });
});

describe('getLabel', function () {
    it('should find a label if it is present', function () {
        const item = Item.fromNothing();
        item.labels.push(Label.fromString('en', 'Jesus'));

        const findLabel = item.findLabel('en');

        expect(findLabel?.language).to.equal('en');
        expect(findLabel?.value).to.equal('Jesus');
    });

    it('should find a label if it is present but an other is', function () {
        const item = Item.fromNothing();
        item.labels.push(Label.fromString('en', 'Jesus'));

        const findLabel = item.findLabel('fr');

        expect(findLabel).to.equal(undefined);
    });

    it('should find a label if it is not present', function () {
        const item = Item.fromNothing();

        const findLabel = item.findLabel('en');

        expect(findLabel).to.equal(undefined);
    });
});

describe('addStatement', function () {
    it('should add a statement', function () {
        const item = Item.fromNothing();
        item.addStatement(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')));

        expect(item.statements.length).to.equal(1);
        expect(item.statements[0].equals(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')))).to.be.true;
    });

    it('should add an array of statements', function () {
        const item = Item.fromNothing();
        item.addStatement([
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')),
            Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q12')),
        ]);

        expect(item.statements.length).to.equal(2);
        expect(item.statements[0].equals(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q11')))).to.be.true;
        expect(item.statements[1].equals(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q12')))).to.be.true;
    });
});

// used for both removeStatement and removeStatements
let item = Item.fromNothing();
let statement1 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.wikidata.org/'));
let statement2 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://en.wikipedia.org/'));
let statement3 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://nl.wikipedia.org/'));

describe('removeStatement', function () {
    beforeEach(function () {
        item = Item.fromNothing();
        statement1 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.wikidata.org/'));
        statement2 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://en.wikipedia.org/'));
        statement3 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://nl.wikipedia.org/'));

        item.statements.push(statement1, statement2, statement3);
    });

    it('should remove a statement if it is present', function () {
        item.removeStatement(statement2);

        expect(item.statements.length).to.be.equal(2);
        expect(item.statements[0].equals(statement1)).to.be.true;
        expect(item.statements[1].equals(statement3)).to.be.true;
    });

    it('should not remove a statement if it is not present', function () {
        item.removeStatement(Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.google.com/')));

        expect(item.statements.length).to.be.equal(3);
        expect(item.statements[0].equals(statement1)).to.be.true;
        expect(item.statements[1].equals(statement2)).to.be.true;
        expect(item.statements[2].equals(statement3)).to.be.true;
    });
});

describe('removeStatements', function () {
    beforeEach(function () {
        item = Item.fromNothing();
        statement1 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.wikidata.org/'));
        statement2 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://en.wikipedia.org/'));
        statement3 = Statement.fromSnak(URLSnak.fromURL('P232', 'https://nl.wikipedia.org/'));
        item.statements.push(statement1, statement2, statement3);
    });

    it('should remove a array of statements if they are present', function () {
        item.removeStatements([statement1, statement3]);

        expect(item.statements.length).to.be.equal(1);
        expect(item.statements[0].equals(statement2)).to.be.true;
    });

    it('should not remove a array of statements if they are not present', function () {
        item.removeStatements([
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.google.com/')),
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.twitter.com/')),
        ]);

        expect(item.statements.length).to.be.equal(3);
        expect(item.statements[0].equals(statement1)).to.be.true;
        expect(item.statements[1].equals(statement2)).to.be.true;
        expect(item.statements[2].equals(statement3)).to.be.true;
    });

    it('should remove some of the statements if some are present', function () {
        item.removeStatements([
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.google.com/')),
            statement1,
            Statement.fromSnak(URLSnak.fromURL('P232', 'https://www.twitter.com/')),
            statement3,
        ]);

        expect(item.statements.length).to.be.equal(1);
        expect(item.statements[0].equals(statement2)).to.be.true;
    });
});

describe('equals', function () {
    it('two different items should not be equal', function () {
        const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[0]}`)).toString('utf8'));
        const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
        const item1 = new Item(wikidataJSON1);

        const contents2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[2]}`)).toString('utf8'));
        const wikidataJSON2 = contents2.entities[Object.keys(contents2.entities)[0]];
        const item2 = new Item(wikidataJSON2);

        expect(item1.equals(item2)).to.be.false;
    });

    it('two of the same item should be equal', function () {
        const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[0]}`)).toString('utf8'));
        const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
        const item1 = new Item(wikidataJSON1);

        expect(item1.equals(item1)).to.be.true;
    });

    it('two empty items should be equal', function () {
        const item1 = Item.fromNothing();
        const item2 = Item.fromNothing();

        expect(item1.equals(item2)).to.be.true;
    });

    it('two items should be equal with different statements should not be equal', function () {
        const item1 = Item.fromNothing();
        item1.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));

        const item2 = Item.fromNothing();
        item2.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q2')));

        expect(item1.equals(item2)).to.be.false;
    });

    it('two items should be equal with the same statements should be equal', function () {
        const item1 = Item.fromNothing();
        item1.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));
        const item2 = Item.fromNothing();
        item2.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P1', 'Q1')));

        expect(item1.equals(item2)).to.be.true;
    });
});

describe('diff', function () {
    it('should find the differences between two different items', function () {
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
        expect(diff).to.deep.equal([
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

    it('should not find differences when there aren\'t any', function () {
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

        expect(diff).to.deep.equal([]);
    });
});
