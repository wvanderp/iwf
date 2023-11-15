import { MusicalNotationSnak } from '../../src';

const musicalNotationSnak = {
    snaktype: 'value' as const,
    property: 'P7598',
    datavalue: {
        value: "\\relative c' {c des eeses f g a bes c \\bar \"|.\"} \\addlyrics{S R\u2081 G\u2081 M\u2081 P D\u2082 N\u2082 \u1E60}",
        type: 'string' as const
    },
    datatype: 'musical-notation' as const
};

describe('Musical Notation Snak', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new MusicalNotationSnak(musicalNotationSnak);

            expect(snak.toJSON()).toStrictEqual(musicalNotationSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new MusicalNotationSnak(musicalNotationSnak);
            const b = new MusicalNotationSnak(musicalNotationSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new MusicalNotationSnak(musicalNotationSnak);
            const b = new MusicalNotationSnak(musicalNotationSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new MusicalNotationSnak(musicalNotationSnak);
            const snak2 = new MusicalNotationSnak(musicalNotationSnak);
            snak2.value = 'F4';

            expect(snak.equals(snak2)).toBe(false);
        });
    });
});
