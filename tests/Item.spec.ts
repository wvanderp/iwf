import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import {
    Item, Label, Statement, WikibaseItemSnak
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
            item2.statements.push(Statement.fromSnak(WikibaseItemSnak.fromID('P2', 'Q1')));

            expect(item1.equals(item2)).to.be.true;
        });
    });
});
