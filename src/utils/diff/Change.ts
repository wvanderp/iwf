/**
 * Represents a change in the system.
 */
export interface Change {
    /**
     * The type of change.
     */
    type: string;
    /**
     * The action performed.
     */
    action: 'add' | 'remove' | 'update';
    /**
     * The ID of the parent element.
     */
    parentID: string;
    /**
     * The old value before the change.
     */
    old?: unknown;
    /**
     * The new value after the change.
     */
    new?: unknown;
}
