import Snak from '../../Snak';
import CommonsMediaSnak from '../../snaks/CommonsMediaSnak';
import ExternalIdentifierSnak from '../../snaks/ExternalIdentifierSnak';
import GeoShapeSnak from '../../snaks/GeoShapeSnak';
import GlobeCoordinateSnak from '../../snaks/GlobeCoordinateSnak';
import MathSnak from '../../snaks/MathSnak';
import MonolingualTextSnak from '../../snaks/MonolingualTextSnak';
import MusicalNotationSnak from '../../snaks/MusicalNotationSnak';
import QuantitySnak from '../../snaks/QuantitySnak';
import StringSnak from '../../snaks/StringSnak';
import TabularDataSnak from '../../snaks/TabularDataSnak';
import TimeSnak from '../../snaks/TimeSnak';
import URLSnak from '../../snaks/URLSnak';
import WikibaseItemSnak from '../../snaks/WikibaseItemSnak';
import WikibasePropertySnak from '../../snaks/WikibasePropertySnak';

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is CommonsMediaSnak} true if the snak is a CommonsMediaSnak
 * @example
 *  if (isCommonsMediaSnak(snak)) {
 *    // do something
 *  }
 */
export function isCommonsMediaSnak(snak: Snak): snak is CommonsMediaSnak {
    return snak instanceof CommonsMediaSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is ExternalIdentifierSnak} true if the snak is a ExternalIdentifierSnak
 * @example
 * if (isExternalIdentifierSnak(snak)) {
 *  // do something
 * }
 */
export function isExternalIdentifierSnak(snak: Snak): snak is ExternalIdentifierSnak {
    return snak instanceof ExternalIdentifierSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is GeoShapeSnak} true if the snak is a GeoShapeSnak
 * @example
 * if (isGeoShapeSnak(snak)) {
 *  // do something
 * }
 */
export function isGeoShapeSnak(snak: Snak): snak is GeoShapeSnak {
    return snak instanceof GeoShapeSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is GlobeCoordinateSnak} true if the snak is a GlobeCoordinateSnak
 * @example
 * if (isGlobeCoordinateSnak(snak)) {
 *  // do something
 * }
 */
export function isGlobeCoordinateSnak(snak: Snak): snak is GlobeCoordinateSnak {
    return snak instanceof GlobeCoordinateSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is MonolingualTextSnak} true if the snak is a MonolingualTextSnak
 * @example
 * if (isMonolingualTextSnak(snak)) {
 *  // do something
 * }
 */
export function isMathSnak(snak: Snak): snak is MathSnak {
    return snak instanceof MathSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is MonolingualTextSnak} true if the snak is a MonolingualTextSnak
 * @example
 * if (isMonolingualTextSnak(snak)) {
 *  // do something
 * }
 */
export function isMonolingualTextSnak(snak: Snak): snak is MonolingualTextSnak {
    return snak instanceof MonolingualTextSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is MusicalNotationSnak} true if the snak is a MusicalNotationSnak
 * @example
 * if (isMusicalNotationSnak(snak)) {
 *  // do something
 * }
 */
export function isMusicalNotationSnak(snak: Snak): snak is MusicalNotationSnak {
    return snak instanceof MusicalNotationSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is QuantitySnak} true if the snak is a QuantitySnak
 * @example
 * if (isQuantitySnak(snak)) {
 *  // do something
 * }
 */
export function isQuantitySnak(snak: Snak): snak is QuantitySnak {
    return snak instanceof QuantitySnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is StringSnak} true if the snak is a StringSnak
 * @example
 * if (isStringSnak(snak)) {
 *  // do something
 * }
 */
export function isStringSnak(snak: Snak): snak is StringSnak {
    return snak instanceof StringSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is TabularDataSnak} true if the snak is a TabularDataSnak
 * @example
 * if (isTabularDataSnak(snak)) {
 *  // do something
 * }
 */
export function isTabularDataSnak(snak: Snak): snak is TabularDataSnak {
    return snak instanceof TabularDataSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is TimeSnak} true if the snak is a TimeSnak
 * @example
 * if (isTimeSnak(snak)) {
 *  // do something
 * }
 */
export function isTimeSnak(snak: Snak): snak is TimeSnak {
    return snak instanceof TimeSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is URLSnak} true if the snak is a URLSnak
 * @example
 * if (isUrlSnak(snak)) {
 *  // do something
 * }
 */
export function isURLSnak(snak: Snak): snak is URLSnak {
    return snak instanceof URLSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is WikibaseItemSnak} true if the snak is a WikibaseItemSnak
 * @example
 * if (isWikibaseItemSnak(snak)) {
 *  // do something
 * }
 */
export function isWikibaseItemSnak(snak: Snak): snak is WikibaseItemSnak {
    return snak instanceof WikibaseItemSnak;
}

/**
 *
 * @param {Snak} snak the snak to check
 * @returns {snak is WikibasePropertySnak} true if the snak is a WikibasePropertySnak
 * @example
 * if (isWikibasePropertySnak(snak)) {
 *  // do something
 * }
 */
export function isWikibasePropertySnak(snak: Snak): snak is WikibasePropertySnak {
    return snak instanceof WikibasePropertySnak;
}
