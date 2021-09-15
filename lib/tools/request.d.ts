import Item from '../Item';
/**
 * @param {string} qid the id of the entity
 * @returns {string} the url with qid
 */
export declare function baseURL(qid: string): string;
/**
 * @param {string} qid the id of the entity
 * @returns {Promise<Item>} the promise of a wikidata Item
 */
export default function requestItem(qid: string): Promise<Item>;
//# sourceMappingURL=request.d.ts.map