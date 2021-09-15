import { describe, it } from 'mocha';
import { expect } from 'chai';
import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import { Description } from '../src';

const description = {
    language: 'en',
    value: 'capital and largest city of Germany'
} as LabelAndDescription;

const description2 = {
    language: 'de',
    value: 'Millionenstadt; Hauptstadt und Land der Bundesrepublik Deutschland'
} as LabelAndDescription;

describe('Description', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const descriptionObject = new Description(description);

            expect(description).to.deep.equal(descriptionObject.toJSON());
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const descriptionObject = new Description(description);

            expect(Description.equals(descriptionObject, descriptionObject)).to.be.true;
        });

        it('should be false if the items are NOT equal', () => {
            const descriptionObject = new Description(description);
            const descriptionObject2 = new Description(description2);

            expect(Description.equals(descriptionObject, descriptionObject2)).to.be.false;
        });
    });
});
