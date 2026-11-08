import { Alias, Description, Item, Label, Reference, SiteLink, Statement, URLSnak } from '../../src';
import snakGenerator from '../../src/utils/snakGenerator';
import * as examples from './testUtils/examples/snaks';

describe('Wikidata input validation', () => {
    for (const Term of [Alias, Description, Label]) {
        it.each([
            { language: 'not-a-language', value: 'text' },
            { language: 'en', value: 42 },
            { language: 'en' }
        ])(`${Term.name} rejects malformed terms`, (term) => {
            // @ts-expect-error Deliberately invalid external input.
            expect(() => new Term(term)).toThrow();
        });
    }

    it('rejects malformed sitelink fields', () => {
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new SiteLink({ site: 'enwiki', title: 42 })).toThrow();
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new SiteLink({ site: 'enwiki', title: 'Earth', badges: [42] })).toThrow();
    });

    it('rejects malformed item metadata and nested collections', () => {
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new Item({ type: 'property' })).toThrow();
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new Item({ type: 'item', lastrevid: '42' })).toThrow();
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new Item({ type: 'item', labels: { en: { language: 'en', value: 42 } } })).toThrow();
    });

    it('rejects malformed statements and references', () => {
        const mainsnak = URLSnak.fromURL('P856', 'https://example.org').toJSON();
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new Statement({ type: 'statement', rank: 'invalid', mainsnak })).toThrow();
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new Reference({ snaks: {}, 'snaks-order': [42] })).toThrow();
    });

    for (const example of Object.values(examples)) {
        const json = example.toJSON();
        it(`rejects a malformed ${json.datatype} payload`, () => {
            expect(() => snakGenerator({ ...json, datavalue: { type: json.datavalue?.type, value: 42 } })).toThrow();
        });
    }

    it('validates direct constructors even when the datatype is omitted', () => {
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new URLSnak({ snaktype: 'value', property: 'P856', datavalue: { type: 'string', value: 42 } })).toThrow();
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new URLSnak({ snaktype: 'value', property: 'P856', datatype: 'string' })).toThrow();
    });

    it('rejects an invalid snak type and a missing value in direct constructors', () => {
        // @ts-expect-error Deliberately invalid external input.
        expect(() => new URLSnak({ snaktype: 'invalid', property: 'P856' })).toThrow();
        expect(() => new URLSnak({ snaktype: 'value', property: 'P856' })).toThrow(/datavalue/);
    });

    for (const example of Object.values(examples)) {
        const SnakConstructor = example.constructor as new (input: unknown) => typeof example;
        const json = example.toJSON();
        it(`validates a direct ${json.datatype} constructor without a datatype`, () => {
            expect(() => new SnakConstructor({ ...json, datatype: undefined })).not.toThrow();
            expect(() => new SnakConstructor({
                ...json, datatype: undefined, datavalue: { type: json.datavalue?.type, value: 42 }
            })).toThrow();
            expect(() => new SnakConstructor({ ...json, datatype: 'unsupported' })).toThrow();
        });
    }
});
