import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Item, Label } from '../src';

const testFiles = fs.readdirSync(path.resolve(__dirname, './data/'));

describe('load data into the model', () => {
    for (const file of testFiles) {
        it(`should return the same contents with as was ingested from ${file}`, function () {
            const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${file}`)).toString('utf-8'));
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
            const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[0]}`)).toString('utf-8'));
            const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
            const item1 = new Item(wikidataJSON1);

            const contents2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[2]}`)).toString('utf-8'));
            const wikidataJSON2 = contents2.entities[Object.keys(contents2.entities)[0]];
            const item2 = new Item(wikidataJSON2);

            expect(item1.equals(item2)).to.be.false;
        });

        it('two of the same item should be equal', function () {
            const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${testFiles[0]}`)).toString('utf-8'));
            const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
            const item1 = new Item(wikidataJSON1);

            expect(item1.equals(item1)).to.be.true;
        });
    });
});
