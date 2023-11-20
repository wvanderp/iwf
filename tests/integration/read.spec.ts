import { requestItem } from '../../src';

describe('reading from wikidata', () => {
    it('should retrieve a item when requested', async () => {
        const item = await requestItem('Q42');

        expect(item).toBeInstanceOf(Object);

        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('labels');
        expect(item).toHaveProperty('descriptions');
        expect(item).toHaveProperty('aliases');
        expect(item).toHaveProperty('statements');
        expect(item).toHaveProperty('sitelinks');

        expect(item.id).toEqual('Q42');
        expect(item.labels).toBeInstanceOf(Array);
        expect(item.descriptions).toBeInstanceOf(Array);
        expect(item.aliases).toBeInstanceOf(Array);
        expect(item.statements).toBeInstanceOf(Array);
        expect(item.sitelinks).toBeInstanceOf(Array);

        expect(item.ns).toEqual(0);
        expect(item.title).toEqual('Q42');

        expect(item.labels.find((label) => label.value === 'Douglas Adams')).toBeInstanceOf(Object);
    });
});
