// imported WikiBaseItemSnak because Snak is abstract
import { Snak, URLSnak, WikibaseItemSnak } from '../../src';

describe('Snak', () => {
    describe('constructor', () => {
        it('supports custom subclasses that use the default upstream schema', () => {
            const json = URLSnak.fromURL('P856', 'https://example.org').toJSON();
            /** Exercises the public extension point for custom snak implementations. */
            class CustomSnak extends Snak {
                datatype = 'url';

                /**
                 * @returns The JSON supplied to the custom snak.
                 * @example
                 *     snak.toJSON();
                 */
                toJSON(): typeof json {
                    return json;
                }

                /**
                 * @param other The snak to compare.
                 * @returns Whether the properties match.
                 * @example
                 *     snak.equals(snak);
                 */
                equals(other: Snak): boolean {
                    return this.property === other.property;
                }
            }
            const snak = new CustomSnak(json);

            expect(snak.property).toBe('P856');
            expect(snak.toJSON()).toStrictEqual(json);
            expect(snak.equals(snak)).toBe(true);
            expect(() => new CustomSnak({ ...json, datavalue: { type: 'string', value: 42 } } as never)).toThrow();
        });

        it('should reject an incompatible datavalue.type in a direct snak constructor', () => {
            const json = URLSnak.fromURL('P856', 'https://example.org').toJSON();
            const malformed = { ...json, datavalue: { type: 'url', value: 'https://example.org' } };

            // @ts-expect-error - invalid value types must also be rejected at runtime.
            expect(() => new URLSnak(malformed)).toThrow(/datavalue\.type/);
        });

        it('should allow a direct snak constructor to infer an omitted datatype', () => {
            const json = { snaktype: 'value' as const, property: 'P856', datavalue: { type: 'string' as const, value: 'https://example.org' } };

            expect(new URLSnak(json).toJSON().datatype).toBe('url');
        });

        it('should reject incorrect property ids', () => {
            // @ts-expect-error - we want to test the error handling
            expect(() => WikibaseItemSnak.fromID('property1', 'Q2221')).toThrow();
        });
    });

    describe('internalID', () => {
        it('should hash the json', () => {
            const snak = WikibaseItemSnak.fromID('P1', 'Q1');
            expect(snak.internalID).toEqual('d87816b2023818e42517e16ad2332b1af4893db28a991d62a528c502147895ed');
        });

        it('should not change when the snak changes', () => {
            const snak = WikibaseItemSnak.fromID('P1', 'Q1');
            const id = snak.internalID;
            snak.property = 'P2';
            expect(snak.internalID).toEqual(id);
        });
    });
});
