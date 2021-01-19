import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Description } from '../src';

const description = new Description({
    language: 'en',
    value: 'capital and largest city of Germany'
});

const description2 = new Description({
    language: 'de',
    value: 'Millionenstadt; Hauptstadt und Land der Bundesrepublik Deutschland'
});

describe('Description', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const labelObject = new Description(description);

            expect(labelObject.toJSON()).to.deep.equal(description);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const labelObject = new Description(description);

            expect(Description.equals(labelObject, labelObject)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const labelObject = new Description(description);
            const labelObject2 = new Description(description2);

            expect(Description.equals(labelObject, labelObject2)).to.be.false;
        });
    });
});
