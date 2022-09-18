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
    describe('internalID', () => {
        it('should be the language and value of the Description', () => {
            const a = new Description(description);
            expect(a.internalID).to.equal('en:capital and largest city of Germany');
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const descriptionObject = new Description(description);

            expect(description).to.deep.equal(descriptionObject.toJSON());
        });
    });

    describe('equals', () => {
        it('should be true if the descriptions are equal', () => {
            const descriptionObject = new Description(description);

            expect(descriptionObject.equals(descriptionObject)).to.be.true;
        });

        it('should be true if the descriptions are equal but not the same object', () => {
            const descriptionObject = new Description(description);
            const descriptionObject2 = new Description(description);

            expect(descriptionObject.equals(descriptionObject2)).to.be.true;
        });

        it('should be false if the descriptions are NOT equal', () => {
            const descriptionObject = new Description(description);
            const descriptionObject2 = new Description(description2);

            expect(descriptionObject.equals(descriptionObject2)).to.be.false;
        });
    });

    describe('fromString', () => {
        it('should create a description from two strings', () => {
            const descriptionObject = Description.fromString('nl', 'sinterklaas is een feest');

            expect(descriptionObject.toJSON()).to.deep.equal({
                language: 'nl',
                value: 'sinterklaas is een feest'
            });
        });
    });
});
