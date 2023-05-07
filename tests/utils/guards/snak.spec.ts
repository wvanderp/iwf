import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
    exampleCommonsMediaSnak,
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
    exampleWikibasePropertySnak
} from '../../testUtils/examples/snaks';
import {
    isCommonsMediaSnak,
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
    isWikibasePropertySnak
} from '../../../src/utils/guards/snak';

describe(
    'isCommonsMediaSnak',
    function () {
        it('should return true if the snak is a CommonsMediaSnak', function () {
            expect(isCommonsMediaSnak(exampleCommonsMediaSnak)).to.be.true;
        });

        it('should return false if the snak is not a isCommonsMediaSnak', function () {
            expect(isCommonsMediaSnak(exampleExternalIdSnak)).to.be.false;
        });
    }
);

describe('isExternalIdSnak', function () {
    it('should return true if the snak is a ExternalIdSnak', function () {
        expect(isExternalIdentifierSnak(exampleExternalIdSnak)).to.be.true;
    });

    it('should return false if the snak is not a isExternalIdSnak', function () {
        expect(isExternalIdentifierSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isGeoShapeSnak', function () {
    it('should return true if the snak is a GeoShapeSnak', function () {
        expect(isGeoShapeSnak(exampleGeoShapeSnak)).to.be.true;
    });

    it('should return false if the snak is not a isGeoShapeSnak', function () {
        expect(isGeoShapeSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isGlobeCoordinateSnak', function () {
    it('should return true if the snak is a GlobeCoordinateSnak', function () {
        expect(isGlobeCoordinateSnak(exampleGlobeCoordinateSnak)).to.be.true;
    });

    it('should return false if the snak is not a isGlobeCoordinateSnak', function () {
        expect(isGlobeCoordinateSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isMathSnak', function () {
    it('should return true if the snak is a MathSnak', function () {
        expect(isMathSnak(exampleMathSnak)).to.be.true;
    });

    it('should return false if the snak is not a isMathSnak', function () {
        expect(isMathSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isMonolingualTextSnak', function () {
    it('should return true if the snak is a MonolingualTextSnak', function () {
        expect(isMonolingualTextSnak(exampleMonolingualTextSnak)).to.be.true;
    });

    it('should return false if the snak is not a isMonolingualTextSnak', function () {
        expect(isMonolingualTextSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isMusicalNotationSnak', function () {
    it('should return true if the snak is a MusicalNotationSnak', function () {
        expect(isMusicalNotationSnak(exampleMusicalNotationSnak)).to.be.true;
    });

    it('should return false if the snak is not a isMusicalNotationSnak', function () {
        expect(isMusicalNotationSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isQuantitySnak', function () {
    it('should return true if the snak is a QuantitySnak', function () {
        expect(isQuantitySnak(exampleQuantitySnak)).to.be.true;
    });

    it('should return false if the snak is not a isQuantitySnak', function () {
        expect(isQuantitySnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isStringSnak', function () {
    it('should return true if the snak is a StringSnak', function () {
        expect(isStringSnak(exampleStringSnak)).to.be.true;
    });

    it('should return false if the snak is not a isStringSnak', function () {
        expect(isStringSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isTabularDataSnak', function () {
    it('should return true if the snak is a TabularDataSnak', function () {
        expect(isTabularDataSnak(exampleTabularDataSnak)).to.be.true;
    });

    it('should return false if the snak is not a isTabularDataSnak', function () {
        expect(isTabularDataSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isTimeSnak', function () {
    it('should return true if the snak is a TimeSnak', function () {
        expect(isTimeSnak(exampleTimeSnak)).to.be.true;
    });

    it('should return false if the snak is not a isTimeSnak', function () {
        expect(isTimeSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isUrlSnak', function () {
    it('should return true if the snak is a UrlSnak', function () {
        expect(isURLSnak(exampleUrlSnak)).to.be.true;
    });

    it('should return false if the snak is not a isUrlSnak', function () {
        expect(isURLSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isWikibaseItemSnak', function () {
    it('should return true if the snak is a WikibaseItemSnak', function () {
        expect(isWikibaseItemSnak(exampleWikibaseItemSnak)).to.be.true;
    });

    it('should return false if the snak is not a isWikibaseItemSnak', function () {
        expect(isWikibaseItemSnak(exampleCommonsMediaSnak)).to.be.false;
    });
});

describe('isWikibasePropertySnak', function () {
    it('should return true if the snak is a WikibasePropertySnak', function () {
        expect(isWikibasePropertySnak(exampleWikibasePropertySnak)).to.be.true;
    });

    it('should return false if the snak is not a isWikibasePropertySnak', function () {
        expect(isWikibasePropertySnak(exampleCommonsMediaSnak)).to.be.false;
    });
});
