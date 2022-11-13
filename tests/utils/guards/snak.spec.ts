import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
    commonsMediaSnak,
    externalIdSnak,
    geoShapeSnak,
    globeCoordinateSnak,
    mathSnak,
    monolingualTextSnak,
    musicalNotationSnak,
    quantitySnak,
    stringSnak,
    tabularDataSnak,
    timeSnak,
    urlSnak,
    wikibaseItemSnak,
    wikibasePropertySnak
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

describe('isCommonsMediaSnak', function () {
    it('should return true if the snak is a CommonsMediaSnak', function () {
        expect(isCommonsMediaSnak(commonsMediaSnak)).to.be.true;
    });

    it('should return false if the snak is not a isCommonsMediaSnak', function () {
        expect(isCommonsMediaSnak(externalIdSnak)).to.be.false;
    });
});

describe('isExternalIdSnak', function () {
    it('should return true if the snak is a ExternalIdSnak', function () {
        expect(isExternalIdentifierSnak(externalIdSnak)).to.be.true;
    });

    it('should return false if the snak is not a isExternalIdSnak', function () {
        expect(isExternalIdentifierSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isGeoShapeSnak', function () {
    it('should return true if the snak is a GeoShapeSnak', function () {
        expect(isGeoShapeSnak(geoShapeSnak)).to.be.true;
    });

    it('should return false if the snak is not a isGeoShapeSnak', function () {
        expect(isGeoShapeSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isGlobeCoordinateSnak', function () {
    it('should return true if the snak is a GlobeCoordinateSnak', function () {
        expect(isGlobeCoordinateSnak(globeCoordinateSnak)).to.be.true;
    });

    it('should return false if the snak is not a isGlobeCoordinateSnak', function () {
        expect(isGlobeCoordinateSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isMathSnak', function () {
    it('should return true if the snak is a MathSnak', function () {
        expect(isMathSnak(mathSnak)).to.be.true;
    });

    it('should return false if the snak is not a isMathSnak', function () {
        expect(isMathSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isMonolingualTextSnak', function () {
    it('should return true if the snak is a MonolingualTextSnak', function () {
        expect(isMonolingualTextSnak(monolingualTextSnak)).to.be.true;
    });

    it('should return false if the snak is not a isMonolingualTextSnak', function () {
        expect(isMonolingualTextSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isMusicalNotationSnak', function () {
    it('should return true if the snak is a MusicalNotationSnak', function () {
        expect(isMusicalNotationSnak(musicalNotationSnak)).to.be.true;
    });

    it('should return false if the snak is not a isMusicalNotationSnak', function () {
        expect(isMusicalNotationSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isQuantitySnak', function () {
    it('should return true if the snak is a QuantitySnak', function () {
        expect(isQuantitySnak(quantitySnak)).to.be.true;
    });

    it('should return false if the snak is not a isQuantitySnak', function () {
        expect(isQuantitySnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isStringSnak', function () {
    it('should return true if the snak is a StringSnak', function () {
        expect(isStringSnak(stringSnak)).to.be.true;
    });

    it('should return false if the snak is not a isStringSnak', function () {
        expect(isStringSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isTabularDataSnak', function () {
    it('should return true if the snak is a TabularDataSnak', function () {
        expect(isTabularDataSnak(tabularDataSnak)).to.be.true;
    });

    it('should return false if the snak is not a isTabularDataSnak', function () {
        expect(isTabularDataSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isTimeSnak', function () {
    it('should return true if the snak is a TimeSnak', function () {
        expect(isTimeSnak(timeSnak)).to.be.true;
    });

    it('should return false if the snak is not a isTimeSnak', function () {
        expect(isTimeSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isUrlSnak', function () {
    it('should return true if the snak is a UrlSnak', function () {
        expect(isURLSnak(urlSnak)).to.be.true;
    });

    it('should return false if the snak is not a isUrlSnak', function () {
        expect(isURLSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isWikibaseItemSnak', function () {
    it('should return true if the snak is a WikibaseItemSnak', function () {
        expect(isWikibaseItemSnak(wikibaseItemSnak)).to.be.true;
    });

    it('should return false if the snak is not a isWikibaseItemSnak', function () {
        expect(isWikibaseItemSnak(commonsMediaSnak)).to.be.false;
    });
});

describe('isWikibasePropertySnak', function () {
    it('should return true if the snak is a WikibasePropertySnak', function () {
        expect(isWikibasePropertySnak(wikibasePropertySnak)).to.be.true;
    });

    it('should return false if the snak is not a isWikibasePropertySnak', function () {
        expect(isWikibasePropertySnak(commonsMediaSnak)).to.be.false;
    });
});
