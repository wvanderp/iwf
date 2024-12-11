import {
    exampleCommonsMediaSnak,
    exampleEntitySchemaSnak,
    exampleExternalIdSnak,
    exampleGeoShapeSnak,
    exampleGlobeCoordinateSnak,
    exampleMathSnak,
    exampleMonolingualTextSnak,
    exampleMusicalNotationSnak,
    exampleQuantitySnak,
    exampleStringSnak,
    exampleTabularDataSnak,
    exampleTimeSnak,
    exampleUrlSnak,
    exampleWikibaseItemSnak,
    exampleWikibaseLexemeSnak,
    exampleWikibasePropertySnak,
    exampleWikibaseSenseSnak
} from '../../testUtils/examples/snaks';
import {
    isCommonsMediaSnak,
    isEntitySchemaSnak,
    isExternalIdentifierSnak,
    isGeoShapeSnak,
    isGlobeCoordinateSnak,
    isMathSnak,
    isMonolingualTextSnak,
    isMusicalNotationSnak,
    isQuantitySnak,
    isStringSnak,
    isTabularDataSnak,
    isTimeSnak,
    isURLSnak,
    isWikibaseItemSnak,
    isWikibaseLexemeSnak,
    isWikibasePropertySnak,
    isWikibaseSenseSnak
} from '../../../../src/utils/guards/snak';

describe(
    'isCommonsMediaSnak',
    function () {
        it('should return true if the snak is a CommonsMediaSnak', function () {
            expect(isCommonsMediaSnak(exampleCommonsMediaSnak)).toBe(true);
        });

        it('should return false if the snak is not a isCommonsMediaSnak', function () {
            expect(isCommonsMediaSnak(exampleExternalIdSnak)).toBe(false);
        });
    }
);

describe('isExternalIdSnak', function () {
    it('should return true if the snak is a ExternalIdSnak', function () {
        expect(isExternalIdentifierSnak(exampleExternalIdSnak)).toBe(true);
    });

    it('should return false if the snak is not a isExternalIdSnak', function () {
        expect(isExternalIdentifierSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isGeoShapeSnak', function () {
    it('should return true if the snak is a GeoShapeSnak', function () {
        expect(isGeoShapeSnak(exampleGeoShapeSnak)).toBe(true);
    });

    it('should return false if the snak is not a isGeoShapeSnak', function () {
        expect(isGeoShapeSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isGlobeCoordinateSnak', function () {
    it('should return true if the snak is a GlobeCoordinateSnak', function () {
        expect(isGlobeCoordinateSnak(exampleGlobeCoordinateSnak)).toBe(true);
    });

    it('should return false if the snak is not a isGlobeCoordinateSnak', function () {
        expect(isGlobeCoordinateSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isMathSnak', function () {
    it('should return true if the snak is a MathSnak', function () {
        expect(isMathSnak(exampleMathSnak)).toBe(true);
    });

    it('should return false if the snak is not a isMathSnak', function () {
        expect(isMathSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isMonolingualTextSnak', function () {
    it('should return true if the snak is a MonolingualTextSnak', function () {
        expect(isMonolingualTextSnak(exampleMonolingualTextSnak)).toBe(true);
    });

    it('should return false if the snak is not a isMonolingualTextSnak', function () {
        expect(isMonolingualTextSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isMusicalNotationSnak', function () {
    it('should return true if the snak is a MusicalNotationSnak', function () {
        expect(isMusicalNotationSnak(exampleMusicalNotationSnak)).toBe(true);
    });

    it('should return false if the snak is not a isMusicalNotationSnak', function () {
        expect(isMusicalNotationSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isQuantitySnak', function () {
    it('should return true if the snak is a QuantitySnak', function () {
        expect(isQuantitySnak(exampleQuantitySnak)).toBe(true);
    });

    it('should return false if the snak is not a isQuantitySnak', function () {
        expect(isQuantitySnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isStringSnak', function () {
    it('should return true if the snak is a StringSnak', function () {
        expect(isStringSnak(exampleStringSnak)).toBe(true);
    });

    it('should return false if the snak is not a isStringSnak', function () {
        expect(isStringSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isTabularDataSnak', function () {
    it('should return true if the snak is a TabularDataSnak', function () {
        expect(isTabularDataSnak(exampleTabularDataSnak)).toBe(true);
    });

    it('should return false if the snak is not a isTabularDataSnak', function () {
        expect(isTabularDataSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isTimeSnak', function () {
    it('should return true if the snak is a TimeSnak', function () {
        expect(isTimeSnak(exampleTimeSnak)).toBe(true);
    });

    it('should return false if the snak is not a isTimeSnak', function () {
        expect(isTimeSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isUrlSnak', function () {
    it('should return true if the snak is a UrlSnak', function () {
        expect(isURLSnak(exampleUrlSnak)).toBe(true);
    });

    it('should return false if the snak is not a isUrlSnak', function () {
        expect(isURLSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isWikibaseItemSnak', function () {
    it('should return true if the snak is a WikibaseItemSnak', function () {
        expect(isWikibaseItemSnak(exampleWikibaseItemSnak)).toBe(true);
    });

    it('should return false if the snak is not a isWikibaseItemSnak', function () {
        expect(isWikibaseItemSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isWikibasePropertySnak', function () {
    it('should return true if the snak is a WikibasePropertySnak', function () {
        expect(isWikibasePropertySnak(exampleWikibasePropertySnak)).toBe(true);
    });

    it('should return false if the snak is not a isWikibasePropertySnak', function () {
        expect(isWikibasePropertySnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isWikibaseSenseSnak', function () {
    it('should return true if the snak is a WikibaseSenseSnak', function () {
        expect(isWikibaseSenseSnak(exampleWikibaseSenseSnak)).toBe(true);
    });

    it('should return false if the snak is not a isWikibaseSenseSnak', function () {
        expect(isWikibaseSenseSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isWikibaseLexemeSnak', function () {
    it('should return true if the snak is a WikibaseLexemeSnak', function () {
        expect(isWikibaseLexemeSnak(exampleWikibaseLexemeSnak)).toBe(true);
    });

    it('should return false if the snak is not a isWikibaseLexemeSnak', function () {
        expect(isWikibaseLexemeSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});

describe('isEntitySchemaSnak', function () {
    it('should return true if the snak is a EntitySchemaSnak', function () {
        expect(isEntitySchemaSnak(exampleEntitySchemaSnak)).toBe(true);
    });

    it('should return false if the snak is not a isEntitySchemaSnak', function () {
        expect(isEntitySchemaSnak(exampleCommonsMediaSnak)).toBe(false);
    });
});
