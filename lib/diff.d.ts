import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import Alias from './Alias';
import Description from './Description';
import Label from './Label';
interface Change {
    type: string;
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: unknown;
    new?: unknown;
}
interface LabelChange extends Change {
    type: 'label';
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}
interface DescriptionChange extends Change {
    type: 'description';
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}
interface AliasChange extends Change {
    type: 'alias';
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: LabelAndDescription;
    new?: LabelAndDescription;
}
/**
 * finds the added, removed, and changed Labels between two Arrays
 *
 * @param {Label[]} o the old array
 * @param {Label[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {LabelChange[]} the changes from the old array to the new array
 */
export declare function labelDiff(o: Label[], n: Label[], parentID: string): LabelChange[];
/**
 * finds the added, removed, and changed descriptions between two Arrays
 *
 * @param {Description[]} o the old array
 * @param {Description[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {DescriptionChange[]} the changes from the old array to the new array
 */
export declare function descriptionDiff(o: Description[], n: Description[], parentID: string): DescriptionChange[];
/**
 * finds the added, removed, and changed aliases between two Arrays
 *
 * @param {Alias[]} o the old array
 * @param {Alias[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {AliasChange[]} the changes from the old array to the new array
 */
export declare function aliasDiff(o: Alias[], n: Alias[], parentID: string): AliasChange[];
export declare type Changes = LabelChange | DescriptionChange | AliasChange;
export {};
//# sourceMappingURL=diff.d.ts.map