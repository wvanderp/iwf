import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { BearerTokenAuth, Item, Label, requestItem, upload, URLSnak, Statement } from '../../../../src';
import { generateUploadData } from '../../../../src/utils/api/upload';

describe('Wikidata validation at API boundaries', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    it('rejects malformed nested values from a real HTTP response', async () => {
        const snak = URLSnak.fromURL('P856', 'https://example.org').toJSON();
        mock.onGet().reply(200, {
            entities: {
                Q1: {
                    type: 'item', id: 'Q1',
                    claims: { P856: [{ type: 'statement', rank: 'normal', mainsnak: { ...snak, datavalue: { type: 'string', value: 42 } } }] }
                }
            }
        });

        await expect(requestItem('Q1', { userAgent: 'validation-tests/1.0' })).rejects.toThrow();
        expect(mock.history.get).toHaveLength(1);
    });

    it('rejects edited model fields before requesting a token or an entity', async () => {
        const item = Item.fromNothing();
        item.id = 'Q1';
        const label = Label.fromString('en', 'Earth');
        // @ts-expect-error JavaScript consumers can mutate fields without type checking.
        label.value = 42;
        item.labels.push(label);
        const auth = new BearerTokenAuth({ accessToken: 'test-token', userAgent: 'validation-tests/1.0' });
        const authMock = new MockAdapter(auth.getAxiosInstance());

        try {
            await expect(upload(item, { summary: 'invalid edit', auth })).rejects.toThrow();
            await expect(generateUploadData(item, 'https://www.wikidata.org')).rejects.toThrow();
            expect(mock.history.get).toHaveLength(0);
            expect(mock.history.post).toHaveLength(0);
            expect(authMock.history.get).toHaveLength(0);
            expect(authMock.history.post).toHaveLength(0);
        } finally {
            authMock.restore();
        }
    });

    it('validates edited nested snaks even when their outer shape is valid', async () => {
        const item = Item.fromNothing();
        const snak = URLSnak.fromURL('P856', 'https://example.org');
        item.statements.push(Statement.fromSnak(snak));
        const editedSnak = item.statements[0].mainsnak as URLSnak;
        editedSnak.url = undefined;

        await expect(upload(item, { anonymous: true, summary: 'invalid snak' })).rejects.toThrow();
        expect(mock.history.post).toHaveLength(0);
    });

    it.each([
        { type: 'item' },
        { type: 'item', id: 'Q1', lastrevid: 'invalid' },
        { type: 'item', id: 'Q1', labels: { en: { language: 'en', value: 42 } } }
    ])('validates the entity in successful edit responses', async (entity) => {
        mock.onPost().reply(200, { success: 1, entity });

        await expect(upload(Item.fromNothing(), { anonymous: true, summary: 'create item' })).rejects.toThrow();
        expect(mock.history.post).toHaveLength(1);
    });
});
