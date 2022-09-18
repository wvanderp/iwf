import { describe, it } from 'mocha';
import { expect } from 'chai';

import { Snak, WikibaseItemSnak } from '../src';

describe('Snak', () => {
    describe('internalID', () => {
        it('should hash the json', () => {
            const snak = WikibaseItemSnak.fromID('P1', 'Q1');

            expect(snak.internalID).to.equal('d87816b2023818e42517e16ad2332b1af4893db28a991d62a528c502147895ed');
        });
    });
});
