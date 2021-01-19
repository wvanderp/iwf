import { Snak as wikidataSnak } from '@wmde/wikibase-datamodel-types';
import Snak from '../Snak';
/**
 * this function takes the json version of a snak and passes it to the proper constructor
 *
 * @private
 * @param {wikidataSnak} snak the snak that needs a constructor
 * @returns {Snak} the snak as a class
 */
export default function snakGenerator(snak: wikidataSnak): Snak;
//# sourceMappingURL=snakGenerator.d.ts.map