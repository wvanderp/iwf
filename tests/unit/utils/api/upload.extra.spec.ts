import axios from 'axios';
import upload from '../../../../src/utils/api/upload';
import Item from '../../../../src/Item';

vi.mock('axios');

const mockedAxios = vi.mocked(axios);

describe('upload extra coverage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('uses an explicit anonymous user agent and merges custom headers', async () => {
        mockedAxios.mockResolvedValue({
            data: {
                entity: Item.fromNothing().toJSON(),
                success: 1
            }
        } as never);

        await upload(Item.fromNothing(), {
            summary: 'Anonymous upload',
            anonymous: true,
            userAgent: 'MyApp/1.0',
            axiosOptions: {
                headers: {
                    'X-Test': '1'
                }
            }
        });

        const config = mockedAxios.mock.calls[0][0] as unknown as { headers: Record<string, string> };

        expect(config.headers).toEqual({
            'User-Agent': 'MyApp/1.0',
            'X-Test': '1'
        });
    });
});
