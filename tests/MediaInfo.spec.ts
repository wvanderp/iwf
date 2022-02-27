import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { MediaInfo, Label } from '../src';

const commonsJson = './data/mediainfoSamples/wikiCommons.json';
const testFiles = fs.readdirSync(path.resolve(__dirname, './data/mediainfoSamples'));

describe('load data into the model', () => {
    for (const file of testFiles) {
        it(`should return the same contents with as was ingested from ${file}`, function () {
            const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/mediainfoSamples/${file}`)).toString('utf8'));
            const wikidataJSON = contents.entities[Object.keys(contents.entities)[0]];
            const item = new MediaInfo(wikidataJSON);

            expect(item.toJSON()).to.deep.equal(wikidataJSON);
        });
    }

    describe('getLabel', function () {
        it('should find a label if it is present', function () {
            const item = MediaInfo.fromNothing();
            item.labels.push(Label.fromString('en', 'Jesus'));

            const findLabel = item.findLabel('en');

            expect(findLabel?.language).to.equal('en');
            expect(findLabel?.value).to.equal('Jesus');
        });

        it('should find a label if it is present but an other is', function () {
            const item = MediaInfo.fromNothing();
            item.labels.push(Label.fromString('en', 'Jesus'));

            const findLabel = item.findLabel('fr');

            expect(findLabel).to.equal(undefined);
        });

        it('should find a label if it is not present', function () {
            const item = MediaInfo.fromNothing();

            const findLabel = item.findLabel('en');

            expect(findLabel).to.equal(undefined);
        });
    });

    describe('equals', function () {
        it('two different items should not be equal', function () {
            const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, commonsJson)).toString('utf8'));
            const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
            const item1 = new MediaInfo(wikidataJSON1);

            const contents2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, commonsJson)).toString('utf8'));
            const wikidataJSON2 = contents2.entities[Object.keys(contents2.entities)[0]];
            const item2 = new MediaInfo(wikidataJSON2);
            item2.title = 'other title';

            expect(item1.equals(item2)).to.be.false;
        });

        it('two of the same item should be equal', function () {
            const contents1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, commonsJson)).toString('utf8'));
            const wikidataJSON1 = contents1.entities[Object.keys(contents1.entities)[0]];
            const item1 = new MediaInfo(wikidataJSON1);

            expect(item1.equals(item1)).to.be.true;
        });
    });
});
