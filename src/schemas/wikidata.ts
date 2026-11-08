import { z } from 'zod';
import { ItemSchema } from '@wvanderp/wikibase-datamodel-types/zod';

import { QStringSchema } from '../types/strings';

// New items have no ID until Wikidata creates them. All other fields use the
// upstream schema unchanged; constructors retain the library's entity-ID checks.
export const ItemInputSchema = ItemSchema.partial({ id: true });

// Serialization always includes every collection, including for a new item.
export const ItemJSONSchema = ItemInputSchema.extend({ id: QStringSchema.optional() }).required({
    labels: true,
    descriptions: true,
    aliases: true,
    claims: true,
    sitelinks: true
});

// wbeditentity wraps an entity differently from wbgetentities. Reuse the same
// entity schema so reads and successful edits accept the same Wikidata data.
export const WbeditentityResponseSchema = z.object({
    entity: ItemSchema,
    success: z.literal(1),
    servedby: z.string().optional()
});
