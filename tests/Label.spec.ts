import { describe, it } from 'mocha';
import { expect } from 'chai';
import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import { Label } from '../src';

const labelJson = {
    language: 'en',
    value: 'Berlin'
} as LabelAndDescription;

const labelJson2 = {
    language: 'it',
    value: 'Berlino'
} as LabelAndDescription;

describe('Label', () => {
    describe('internalID', () => {
        it('should be the language and value of the label', () => {
            const label = new Label(labelJson);
            expect(label.internalID).to.equal('en:Berlin');
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const label = new Label(labelJson);

            expect(label.toJSON()).to.deep.equal(labelJson);
        });
    });

    describe('equals', () => {
        it('should be true if the labels are equal', () => {
            const label = new Label(labelJson);

            expect(label.equals(label)).to.be.true;
        });

        it('should be true if the labels are equal but not the same object', () => {
            const label = new Label(labelJson);
            const label2 = new Label(labelJson);

            expect(label.equals(label2)).to.be.true;
        });

        it('should be false if the labels are NOT equal', () => {
            const label = new Label(labelJson);
            const label2 = new Label(labelJson2);

            expect(label.equals(label2)).to.be.false;
        });
    });

    describe('fromString', () => {
        it('should create a label from two strings', () => {
            const label = Label.fromString('nl', 'sinterklaas');

            expect(label.toJSON()).to.deep.equal({
                language: 'nl',
                value: 'sinterklaas'
            });
        });
    });
});
