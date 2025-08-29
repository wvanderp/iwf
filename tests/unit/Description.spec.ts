import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import { Description } from '../../src';

const descriptionJson = {
    language: 'en',
    value: 'capital and largest city of Germany'
} as LabelAndDescription;

const descriptionJson2 = {
    language: 'de',
    value: 'Millionenstadt; Hauptstadt und Land der Bundesrepublik Deutschland'
} as LabelAndDescription;

describe('Description', () => {
    describe('constructor', () => {
        it("should throw when language is 'mul'", () => {
            expect(() => new Description({ language: 'mul', value: 'anything' } as LabelAndDescription)).toThrow("The 'mul' language is not allowed for descriptions.");
        });
    });
    describe('internalID', () => {
        it('should be the language and value of the Description', () => {
            const description = new Description(descriptionJson);
            expect(description.internalID).toEqual('en:capital and largest city of Germany');
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const description = new Description(descriptionJson);

            expect(descriptionJson).toStrictEqual(description.toJSON());
        });
    });

    describe('equals', () => {
        it('should be true if the descriptions are equal', () => {
            const description = new Description(descriptionJson);

            expect(description.equals(description)).toBe(true);
        });

        it('should be true if the descriptions are equal but not the same object', () => {
            const description = new Description(descriptionJson);
            const description2 = new Description(descriptionJson);

            expect(description.equals(description2)).toBe(true);
        });

        it('should be false if the descriptions are NOT equal', () => {
            const description = new Description(descriptionJson);
            const description2 = new Description(descriptionJson2);

            expect(description.equals(description2)).toBe(false);
        });
    });

    describe('fromString', () => {
        it('should create a description from two strings', () => {
            const description = Description.fromString('nl', 'sinterklaas is een feest');

            expect(description.toJSON()).toStrictEqual({
                language: 'nl',
                value: 'sinterklaas is een feest'
            });
        });
    });
});
