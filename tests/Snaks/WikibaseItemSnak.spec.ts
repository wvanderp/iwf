import { expect } from 'chai';
import { describe, it } from 'mocha';
import WikibaseItemSnak from '../../src/snaks/WikibaseItemSnak';

const wikibaseItemSnak = {
    snaktype: 'value' as const,
    property: 'P150',
    datavalue: {
        value: {
            'entity-type': 'item' as const,
            'numeric-id': 158893,
            id: 'Q158893'
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'wikibase-item' as const
};

describe('Wikibase Item Snak', () => {
    it('should Ingest normal snak object', () => {
        // eslint-disable-next-line no-new
        new WikibaseItemSnak(wikibaseItemSnak);
    });

    describe('get ID', () => {
        it('should return the id including the Q when there is a ID', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            expect(snak.id).to.equal(`Q${wikibaseItemSnak.datavalue.value['numeric-id']}`);
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibaseItemSnak({
                snaktype: 'novalue',
                property: 'P150',
                datatype: 'wikibase-item' as const
            });

            expect(snak.id).to.equal(undefined);
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibaseItemSnak(wikibaseItemSnak);

            expect(snak.toJSON()).to.deep.equal(wikibaseItemSnak);
        });
    });
});
