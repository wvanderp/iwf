import axios from 'axios';
import getToken, { loginUrl } from '../../../../src/utils/api/token';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getToken', () => {
    it('should throw when the input is rubbish', async () => {
        mockedAxios.post.mockResolvedValue({ boink: 'boink' });
        mockedAxios.get.mockResolvedValue({ boink: 'boink' });

        // @ts-expect-error testing
        await expect(() => getToken()).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken('')).rejects.toThrow();
        await expect(() => getToken('a', '')).rejects.toThrow();
        await expect(() => getToken('', 'a')).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken(null, 'a')).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken('a', null)).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken(null, null)).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken(undefined, 'a')).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken('a')).rejects.toThrow();

        // @ts-expect-error testing
        await expect(() => getToken('a', 'a', '')).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken('a', 'a', null)).rejects.toThrow();
    });

    it('should return the correct url', () => {
        // normal urls
        expect(loginUrl('https://www.wikidata.org')).toBe('https://www.wikidata.org/w/api.php?action=login&format=json');
        expect(loginUrl('https://test.wikidata.org')).toBe('https://test.wikidata.org/w/api.php?action=login&format=json');

        // urls with a path
        expect(loginUrl('https://www.wikidata.org/wiki/Main_Page')).toBe('https://www.wikidata.org/w/api.php?action=login&format=json');
        expect(loginUrl('https://test.wikidata.org/wiki/Main_Page')).toBe('https://test.wikidata.org/w/api.php?action=login&format=json');
    });
});
