import { expect } from 'chai';
import { describe, it } from 'mocha';
import URLSnak from '../../src/snaks/UrlSnak';

const urlSnak = {
    snaktype: 'value' as const,
    property: 'P854',
    datavalue: {
        value: 'http://www.berlin.de/special/immobilien-und-wohnen/stadtteile/',
        type: 'string'
    },
    datatype: 'url' as const
};

describe('URL Snak', () => {
    it('should Ingest normal snak object', () => {
        // eslint-disable-next-line no-new
        new URLSnak(urlSnak);
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new URLSnak(urlSnak);

            expect(snak.toJSON()).to.deep.equal(urlSnak);
        });
    });
});
