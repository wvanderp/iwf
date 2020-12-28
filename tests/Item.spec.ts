import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import Item from '../src/Item';

describe('load data into the model', () => {
    for (const file of fs.readdirSync(path.resolve(__dirname, './data/'))) {
        it(`should Ingest normal wikidata object from ${file}`, function () {
            const item = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${file}`)).toString('utf-8'));
            // eslint-disable-next-line no-new
            new Item(item.entities[Object.keys(item.entities)[0]]);
        });

        it(`should return the same contents with as was ingested from ${file}`, function () {
            const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${file}`)).toString('utf-8'));
            const wikidataJSON = contents.entities[Object.keys(contents.entities)[0]];
            const item = new Item(wikidataJSON);

            expect(item.toJSON()).to.deep.equal(wikidataJSON);
        });
    }
});
