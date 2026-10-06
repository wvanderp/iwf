import CommonsMediaSnak from '../snaks/CommonsMediaSnak';
import EntitySchemaSnak from '../snaks/EntitySchemaSnak';
import ExternalIdentifierSnak from '../snaks/ExternalIdentifierSnak';
import GeoShapeSnak from '../snaks/GeoShapeSnak';
import GlobeCoordinateSnak from '../snaks/GlobeCoordinateSnak';
import MathSnak from '../snaks/MathSnak';
import MonolingualTextSnak from '../snaks/MonolingualTextSnak';
import MusicalNotationSnak from '../snaks/MusicalNotationSnak';
import QuantitySnak from '../snaks/QuantitySnak';
import StringSnak from '../snaks/StringSnak';
import TabularDataSnak from '../snaks/TabularDataSnak';
import TimeSnak from '../snaks/TimeSnak';
import URLSnak from '../snaks/URLSnak';
import WikibaseFormSnak from '../snaks/WikibaseFormSnak';
import WikibaseItemSnak from '../snaks/WikibaseItemSnak';
import WikibaseLexemeSnak from '../snaks/WikibaseLexemeSnak';
import WikibasePropertySnak from '../snaks/WikibasePropertySnak';
import WikibaseSenseSnak from '../snaks/WikibaseSenseSnak';

export type Snaks =
    CommonsMediaSnak
    | EntitySchemaSnak
    | ExternalIdentifierSnak
    | GeoShapeSnak
    | GlobeCoordinateSnak
    | MathSnak
    | MonolingualTextSnak
    | MusicalNotationSnak
    | QuantitySnak
    | StringSnak
    | TabularDataSnak
    | TimeSnak
    | URLSnak
    | WikibaseFormSnak
    | WikibaseItemSnak
    | WikibaseLexemeSnak
    | WikibasePropertySnak
    | WikibaseSenseSnak;
