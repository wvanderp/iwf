import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Item } from '../src';

describe('load data into the model', () => {
    for (const file of fs.readdirSync(path.resolve(__dirname, './data/'))) {
        it(`should return the same contents with as was ingested from ${file}`, function () {
            const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${file}`)).toString('utf-8'));
            const wikidataJSON = contents.entities[Object.keys(contents.entities)[0]];
            const item = new Item(wikidataJSON);

            expect(item.toJSON()).to.deep.equal(wikidataJSON);
        });
    }
});
