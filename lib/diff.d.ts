import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import Label from './Label';
interface Change {
    type: string;
    action: 'add' | 'remove' | 'update';
    parentID: string;
    orig?: unknown;
    new?: unknown;
}
interface LabelChange extends Change {
    type: 'label';
    action: 'add' | 'remove' | 'update';
    parentID: string;
    orig?: LabelAndDescription;
    new?: LabelAndDescription;
}
/**
 * @param {Label[]} o the old array
 * @param {Label[]} n the new array
 * @param parentID
 */
export declare function labelDiff(o: Label[], n: Label[], parentID: string): LabelChange[];
export declare type Changes = LabelChange;
export {};
//# sourceMappingURL=diff.d.ts.map