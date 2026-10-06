import { WikibaseFormSnak } from '../../../src';

const wikibaseFormSnak = {
    snaktype: 'value' as const,
    property: 'P5830',
    datavalue: {
        value: {
            'entity-type': 'form' as const,
            id: 'L123-F4'
        },
        type: 'wikibase-entityid' as const
    },
    datatype: 'wikibase-form' as const
};

describe('Wikibase Form Snak', () => {
    describe('constructor', () => {
        it('should split the form ID into lexemeId and formId', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);

            expect(snak.lexemeId).toBe(123);
            expect(snak.formId).toBe(4);
        });

        it('should leave the ids undefined when there is no value', () => {
            const snak = new WikibaseFormSnak({
                snaktype: 'novalue',
                property: 'P5830',
                datatype: 'wikibase-form'
            });

            expect(snak.lexemeId).toBeUndefined();
            expect(snak.formId).toBeUndefined();
        });
    });

    describe('get ID', () => {
        it('should return the id in L{number}-F{number} format when there is a value', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            expect(snak.id).toBe('L123-F4');
        });

        it('should return undefined when there is no value', () => {
            const snak = new WikibaseFormSnak({
                snaktype: 'novalue',
                property: 'P5830',
                datatype: 'wikibase-form'
            });
            expect(snak.id).toBeUndefined();
        });
    });

    describe('set ID', () => {
        it('should set lexemeId and formId from the combined ID', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            snak.id = 'L789-F10';

            expect(snak.lexemeId).toBe(789);
            expect(snak.formId).toBe(10);
            expect(snak.id).toBe('L789-F10');
        });

        it('should clear both ids and become a novalue snak when id is undefined', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            snak.id = undefined;

            expect(snak.lexemeId).toBeUndefined();
            expect(snak.formId).toBeUndefined();
            expect(snak.snaktype).toBe('novalue');
        });

        it('should throw when the id is not a form ID', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);

            expect(() => { snak.id = 'L123-S4'; }).toThrow('L123-S4 is not a valid form ID');
            expect(snak.id).toBe('L123-F4');
        });
    });

    describe('lexemeId', () => {
        it('should get and set lexemeId', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            snak.lexemeId = 789;

            expect(snak.lexemeId).toBe(789);
            expect(snak.id).toBe('L789-F4');
        });

        it('should become a novalue snak when lexemeId is undefined', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            snak.lexemeId = undefined;

            expect(snak.lexemeId).toBeUndefined();
            expect(snak.snaktype).toBe('novalue');
        });
    });

    describe('formId', () => {
        it('should get and set formId', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            snak.formId = 7;

            expect(snak.formId).toBe(7);
            expect(snak.id).toBe('L123-F7');
        });

        it('should become a novalue snak when formId is undefined', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            snak.formId = undefined;

            expect(snak.formId).toBeUndefined();
            expect(snak.snaktype).toBe('novalue');
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new WikibaseFormSnak(wikibaseFormSnak);
            expect(snak.toJSON()).toStrictEqual(wikibaseFormSnak);
        });

        it('should serialize a novalue snak without datavalue', () => {
            const snak = new WikibaseFormSnak({
                snaktype: 'novalue',
                property: 'P5830',
                datatype: 'wikibase-form'
            });

            expect(snak.toJSON()).toStrictEqual({
                snaktype: 'novalue',
                property: 'P5830',
                datatype: 'wikibase-form'
            });
        });
    });

    describe('equals', () => {
        it('should be true if the snaks are equal', () => {
            const a = new WikibaseFormSnak(wikibaseFormSnak);
            const b = new WikibaseFormSnak(wikibaseFormSnak);
            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new WikibaseFormSnak(wikibaseFormSnak);
            const b = new WikibaseFormSnak(wikibaseFormSnak);
            b.property = 'P42';
            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the lexemeId changes', () => {
            const a = new WikibaseFormSnak(wikibaseFormSnak);
            const b = new WikibaseFormSnak(wikibaseFormSnak);
            b.lexemeId = 999;
            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the formId changes', () => {
            const a = new WikibaseFormSnak(wikibaseFormSnak);
            const b = new WikibaseFormSnak(wikibaseFormSnak);
            b.formId = 999;
            expect(a.equals(b)).toBe(false);
        });
    });

    describe('fromData', () => {
        it('should create a snak from a property and a form ID', () => {
            const snak = WikibaseFormSnak.fromData('P5830', 'L42-F7');

            expect(snak.property).toBe('P5830');
            expect(snak.id).toBe('L42-F7');
            expect(snak.toJSON()).toStrictEqual({
                snaktype: 'value',
                property: 'P5830',
                datavalue: {
                    value: {
                        'entity-type': 'form',
                        id: 'L42-F7'
                    },
                    type: 'wikibase-entityid'
                },
                datatype: 'wikibase-form'
            });
        });
    });
});
