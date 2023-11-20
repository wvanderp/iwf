import { URLSnak } from '../../../src';

const urlSnak = {
    snaktype: 'value' as const,
    property: 'P854',
    datavalue: {
        value: 'http://www.berlin.de/special/immobilien-und-wohnen/stadtteile/',
        type: 'string' as const
    },
    datatype: 'url' as const
};

describe('URL Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new URLSnak(urlSnak);

            expect(snak.toJSON()).toStrictEqual(urlSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new URLSnak(urlSnak);
            const b = new URLSnak(urlSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new URLSnak(urlSnak);
            const b = new URLSnak(urlSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new URLSnak(urlSnak);
            const snak2 = new URLSnak(urlSnak);
            snak2.value = 'http://wikidata.org/';

            expect(snak.equals(snak2)).toBe(false);
        });
    });

    describe('fromURL', () => {
        it('should create a snak from an ID', () => {
            const snak = URLSnak.fromURL('P854', 'https://www.typescriptlang.org/');

            expect(snak.property).toEqual('P854');
            expect(snak.url).toEqual('https://www.typescriptlang.org/');
        });
    });
});
