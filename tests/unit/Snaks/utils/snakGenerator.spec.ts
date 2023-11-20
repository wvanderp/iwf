import snakGenerator from '../../../../src/utils/snakGenerator';

const unknownSnak = {
    snaktype: 'value' as const,
    property: 'P582',
    datavalue: {},
    datatype: 'unknown' as const
};

describe('snakGenerator', () => {
    it('should throw when unexpected snak type is found', () => {
        expect(() => snakGenerator(unknownSnak)).toThrow();
    });
});
