import axios from 'axios';
import getToken from '../../../src/utils/api/token';

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

        await expect(() => getToken('a', 'a', '')).rejects.toThrow();
        // @ts-expect-error testing
        await expect(() => getToken('a', 'a', null)).rejects.toThrow();
    });
});
