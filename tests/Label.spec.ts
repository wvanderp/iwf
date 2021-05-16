import { describe, it } from 'mocha';
import { expect } from 'chai';
import Label from '../src/Label';

const label = {
    language: 'en',
    value: 'Berlin'
};

const label2 = {
    language: 'it',
    value: 'Berlino'
};

describe('Label', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const labelObject = new Label(label);

            expect(labelObject.toJSON()).to.deep.equal(label);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const labelObject = new Label(label);

            expect(labelObject.equals(labelObject)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const labelObject = new Label(label);
            const labelObject2 = new Label(label2);

            expect(labelObject.equals(labelObject2)).to.be.false;
        });
    });
});
