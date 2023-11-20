import { CommonsMediaSnak } from '../../../src';

const commonsSnak = {
    snaktype: 'value' as const,
    property: 'P41',
    datavalue: {
        value: 'Flag of Berlin.svg',
        type: 'string' as const
    },
    datatype: 'commonsMedia' as const
};

describe('Commons Media Snak', () => {
    it('should return the right image link', () => {
        const snak = new CommonsMediaSnak(commonsSnak);

        expect(snak.imageLink).toEqual('https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag of Berlin.svg');
    });

    it('should return the right commons link', () => {
        const snak = new CommonsMediaSnak(commonsSnak);

        expect(snak.commonsLink).toEqual('https://commons.wikimedia.org/wiki/File:Flag of Berlin.svg');
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const snak = new CommonsMediaSnak(commonsSnak);

            expect(snak.toJSON()).toStrictEqual(commonsSnak);
        });
    });

    describe('equals', () => {
        it('should be true if the items are equal', () => {
            const a = new CommonsMediaSnak(commonsSnak);
            const b = new CommonsMediaSnak(commonsSnak);

            expect(a.equals(b)).toBe(true);
        });

        it('should be false if the property changes', () => {
            const a = new CommonsMediaSnak(commonsSnak);
            const b = new CommonsMediaSnak(commonsSnak);

            b.property = 'P42';

            expect(a.equals(b)).toBe(false);
        });

        it('should be false if the items are NOT equal', () => {
            const snak = new CommonsMediaSnak(commonsSnak);
            const snak2 = new CommonsMediaSnak(commonsSnak);
            snak2.fileName = 'Flag of Amsterdam.svg';

            expect(snak.equals(snak2)).toBe(false);
        });
    });
});
