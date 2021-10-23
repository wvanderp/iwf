export interface Change {
    type: string;
    action: 'add' | 'remove' | 'update';
    parentID: string;
    old?: unknown;
    new?: unknown;
}
