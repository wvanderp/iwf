import { describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { baseURL } from '../../src/tools/request';
import { requestItem } from '../../src';

describe('baseURL functions', () => {
    it('should return the right url when a QID is given', () => {
        expect(baseURL('Q42')).to.be.equal('https://www.wikidata.org/wiki/Special:EntityData/Q42.json');
    });
});

describe('requestItem functions', () => {
    it('should return the right data when a QID is given', async () => {
        const contents = JSON.parse(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    `../data/${fs.readdirSync(path.resolve(__dirname, '../data/'))[0]
                    }`
                )
            ).toString('utf-8')
        );

        const QID = Object.keys(contents.entities)[0];
        const wikidataJSON = contents.entities[QID];

        const mock = new MockAdapter(axios);
        mock.onGet(`https://www.wikidata.org/wiki/Special:EntityData/${QID}.json`).reply(200, contents);

        expect((await requestItem(QID)).toJSON()).to.deep.equal(wikidataJSON);
    });
});
