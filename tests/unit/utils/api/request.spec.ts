import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { baseURL } from '../../../../src/utils/api/request';
import { requestItem } from '../../../../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('baseURL functions', () => {
    it('should return the right url when a QID is given', () => {
        expect(baseURL('Q42')).toEqual('https://www.wikidata.org/wiki/Special:EntityData/Q42.json');
    });

    it('should return the right url when a QID and a server is given', () => {
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org')).toEqual('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
    });

    it('should return the right url when a QID and a server is given but the server is also a url', () => {
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Special:EntityData')).toEqual('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Special:EntityData/')).toEqual('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Tag:highway%3Dconstruction')).toEqual('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');
        expect(baseURL('Q5302', 'https://wiki.openstreetmap.org/wiki/Tag:highway%3Dconstruction/')).toEqual('https://wiki.openstreetmap.org/wiki/Special:EntityData/Q5302.json');

        expect(baseURL('Q42', 'http://www.wikidata.org/wiki/Q23')).toEqual('http://www.wikidata.org/wiki/Special:EntityData/Q42.json');
    });

    it('should not accept a invalid server', () => {
        expect(() => baseURL('Q42', 'dasdasdsad')).toThrow();
        // more examples
        expect(() => baseURL('Q42', 'wikidata.org')).toThrow();
        expect(() => baseURL('Q42', 'www.wikidata.org')).toThrow();

        expect(() => baseURL('q42')).not.toThrow();
        expect(() => baseURL('q42', 'http://www.wikidata.org')).not.toThrow();
    });
});

describe('requestItem functions', () => {
    const contents = {
        data: {
            ...JSON.parse(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        `../../data/${fs.readdirSync(path.resolve(__dirname, '../../data/'))[0]
                        }`
                    )
                ).toString('utf8')
            ),
            success: 1
        }
    };
    const QID = Object.keys(contents.data.entities)[0];
    const wikidataJSON = contents.data.entities[QID];

    it('should return the right data when a QID is given', async () => {
        mockedAxios.get.mockResolvedValue(contents);

        const data = await requestItem(QID);
        expect(data.toJSON()).toStrictEqual(wikidataJSON);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `https://www.wikidata.org/wiki/Special:EntityData/${QID}.json`,
            { headers: { 'User-Agent': 'iwf/0.1.1' } }
        );
    });

    it('should use custom user-agent when provided', async () => {
        mockedAxios.get.mockResolvedValue(contents);

        const data = await requestItem(QID, { userAgent: 'CustomApp/1.0' });
        expect(data.toJSON()).toStrictEqual(wikidataJSON);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `https://www.wikidata.org/wiki/Special:EntityData/${QID}.json`,
            { headers: { 'User-Agent': 'CustomApp/1.0' } }
        );
    });

    it('should handle garbage inputs', async () => {
        await expect(() => requestItem('')).rejects.toThrow();
        await expect(() => requestItem('Q42', { server: 'dasdasdsad' })).rejects.toThrow();
        await expect(() => requestItem('42', { server: 'wikidata.org' })).rejects.toThrow();
    });
});
