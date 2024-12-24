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
import EntitySchemaSnak from '../../snaks/EntitySchemaSnak';
import WikibaseSenseSnak from '../../snaks/WikibaseSenseSnak';
import WikibaseLexemeSnak from '../../snaks/WikibaseLexemeSnak';

/**
 * Tests if a snak is a CommonsMediaSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is CommonsMediaSnak} True if the snak is a CommonsMediaSnak.
 * @example
 *  if (isCommonsMediaSnak(snak)) {
 *    // Do something
 *  }
 */
export function isCommonsMediaSnak(snak: Snak): snak is CommonsMediaSnak {
    return snak instanceof CommonsMediaSnak;
}

/**
 * Tests if a snak is an ExternalIdentifierSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is ExternalIdentifierSnak} True if the snak is an ExternalIdentifierSnak.
 * @example
 * if (isExternalIdentifierSnak(snak)) {
 *  // Do something
 * }
 */
export function isExternalIdentifierSnak(snak: Snak): snak is ExternalIdentifierSnak {
    return snak instanceof ExternalIdentifierSnak;
}

/**
 * Tests if a snak is a GeoShapeSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is GeoShapeSnak} True if the snak is a GeoShapeSnak.
 * @example
 * if (isGeoShapeSnak(snak)) {
 *  // Do something
 * }
 */
export function isGeoShapeSnak(snak: Snak): snak is GeoShapeSnak {
    return snak instanceof GeoShapeSnak;
}

/**
 * Tests if a snak is a GlobeCoordinateSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is GlobeCoordinateSnak} True if the snak is a GlobeCoordinateSnak.
 * @example
 * if (isGlobeCoordinateSnak(snak)) {
 *  // Do something
 * }
 */
export function isGlobeCoordinateSnak(snak: Snak): snak is GlobeCoordinateSnak {
    return snak instanceof GlobeCoordinateSnak;
}

/**
 * Tests if a snak is a MathSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is MathSnak} True if the snak is a MathSnak.
 * @example
 * if (isMathSnak(snak)) {
 *  // Do something
 * }
 */
export function isMathSnak(snak: Snak): snak is MathSnak {
    return snak instanceof MathSnak;
}

/**
 * Tests if a snak is a MonolingualTextSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is MonolingualTextSnak} True if the snak is a MonolingualTextSnak.
 * @example
 * if (isMonolingualTextSnak(snak)) {
 *  // Do something
 * }
 */
export function isMonolingualTextSnak(snak: Snak): snak is MonolingualTextSnak {
    return snak instanceof MonolingualTextSnak;
}

/**
 * Tests if a snak is a MusicalNotationSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is MusicalNotationSnak} True if the snak is a MusicalNotationSnak.
 * @example
 * if (isMusicalNotationSnak(snak)) {
 *  // Do something
 * }
 */
export function isMusicalNotationSnak(snak: Snak): snak is MusicalNotationSnak {
    return snak instanceof MusicalNotationSnak;
}

/**
 * Tests if a snak is a QuantitySnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is QuantitySnak} True if the snak is a QuantitySnak.
 * @example
 * if (isQuantitySnak(snak)) {
 *  // Do something
 * }
 */
export function isQuantitySnak(snak: Snak): snak is QuantitySnak {
    return snak instanceof QuantitySnak;
}

/**
 * Tests if a snak is a StringSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is StringSnak} True if the snak is a StringSnak.
 * @example
 * if (isStringSnak(snak)) {
 *  // Do something
 * }
 */
export function isStringSnak(snak: Snak): snak is StringSnak {
    return snak instanceof StringSnak;
}

/**
 * Tests if a snak is a TabularDataSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is TabularDataSnak} True if the snak is a TabularDataSnak.
 * @example
 * if (isTabularDataSnak(snak)) {
 *  // Do something
 * }
 */
export function isTabularDataSnak(snak: Snak): snak is TabularDataSnak {
    return snak instanceof TabularDataSnak;
}

/**
 * Tests if a snak is a TimeSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is TimeSnak} True if the snak is a TimeSnak.
 * @example
 * if (isTimeSnak(snak)) {
 *  // Do something
 * }
 */
export function isTimeSnak(snak: Snak): snak is TimeSnak {
    return snak instanceof TimeSnak;
}

/**
 * Tests if a snak is a URLSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is URLSnak} True if the snak is a URLSnak.
 * @example
 * if (isURLSnak(snak)) {
 *  // Do something
 * }
 */
export function isURLSnak(snak: Snak): snak is URLSnak {
    return snak instanceof URLSnak;
}

/**
 * Tests if a snak is a WikibaseItemSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is WikibaseItemSnak} True if the snak is a WikibaseItemSnak.
 * @example
 * if (isWikibaseItemSnak(snak)) {
 *  // Do something
 * }
 */
export function isWikibaseItemSnak(snak: Snak): snak is WikibaseItemSnak {
    return snak instanceof WikibaseItemSnak;
}

/**
 * Tests if a snak is a WikibasePropertySnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is WikibasePropertySnak} True if the snak is a WikibasePropertySnak.
 * @example
 * if (isWikibasePropertySnak(snak)) {
 *  // Do something
 * }
 */
export function isWikibasePropertySnak(snak: Snak): snak is WikibasePropertySnak {
    return snak instanceof WikibasePropertySnak;
}

/**
 * Tests if a snak is an EntitySchemaSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is EntitySchemaSnak} True if the snak is an EntitySchemaSnak.
 * @example
 * if (isEntitySchemaSnak(snak)) {
 *  // Do something
 * }
 */
export function isEntitySchemaSnak(snak: Snak): snak is EntitySchemaSnak {
    return snak instanceof EntitySchemaSnak;
}

/**
 * Tests if a snak is a WikibaseSenseSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is WikibaseSenseSnak} True if the snak is a WikibaseSenseSnak.
 * @example
 * if (isWikibaseSenseSnak(snak)) {
 *  // Do something
 * }
 */
export function isWikibaseSenseSnak(snak: Snak): snak is WikibaseSenseSnak {
    return snak instanceof WikibaseSenseSnak;
}

/**
 * Tests if a snak is a WikibaseLexemeSnak.
 *
 * @param {Snak} snak The snak to check.
 * @returns {snak is WikibaseLexemeSnak} True if the snak is a WikibaseLexemeSnak.
 * @example
 * if (isWikibaseLexemeSnak(snak)) {
 *  // Do something
 * }
 */
export function isWikibaseLexemeSnak(snak: Snak): snak is WikibaseLexemeSnak {
    return snak instanceof WikibaseLexemeSnak;
}
