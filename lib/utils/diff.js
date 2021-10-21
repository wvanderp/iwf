"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliasDiff = exports.descriptionDiff = exports.labelDiff = void 0;
const diff_arrays_of_objects_1 = __importDefault(require("diff-arrays-of-objects"));
/**
 * finds the added, removed, and changed Labels between two Arrays
 *
 * @param {Label[]} o the old array
 * @param {Label[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {LabelChange[]} the changes from the old array to the new array
 */
function labelDiff(o, n, parentID) {
    const changes = [];
    for (const label of o) {
        const counterLabel = n.find((l) => l.language === label.language);
        if (counterLabel === undefined) {
            changes.push({
                type: 'label',
                action: 'remove',
                parentID,
                old: label.toJSON()
            });
        }
        if (counterLabel !== undefined && label.value !== counterLabel.value) {
            changes.push({
                type: 'label',
                action: 'update',
                parentID,
                old: label.toJSON(),
                new: counterLabel.toJSON()
            });
        }
    }
    for (const label of n) {
        const counterLabel = o.find((l) => l.language === label.language);
        if (counterLabel === undefined) {
            changes.push({
                type: 'label',
                action: 'add',
                parentID,
                new: label.toJSON()
            });
        }
    }
    return changes;
}
exports.labelDiff = labelDiff;
/**
 * finds the added, removed, and changed descriptions between two Arrays
 *
 * @param {Description[]} o the old array
 * @param {Description[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {DescriptionChange[]} the changes from the old array to the new array
 */
function descriptionDiff(o, n, parentID) {
    const changes = [];
    for (const description of o) {
        const counterDescription = n.find((l) => l.language === description.language);
        if (counterDescription === undefined) {
            changes.push({
                type: 'description',
                action: 'remove',
                parentID,
                old: description.toJSON()
            });
        }
        if (counterDescription !== undefined && description.value !== counterDescription.value) {
            changes.push({
                type: 'description',
                action: 'update',
                parentID,
                old: description.toJSON(),
                new: counterDescription.toJSON()
            });
        }
    }
    for (const description of n) {
        const counterDescription = o.find((l) => l.language === description.language);
        if (counterDescription === undefined) {
            changes.push({
                type: 'description',
                action: 'add',
                parentID,
                new: description.toJSON()
            });
        }
    }
    return changes;
}
exports.descriptionDiff = descriptionDiff;
/**
 * finds the added, removed, and changed aliases between two Arrays
 *
 * @param {Alias[]} o the old array
 * @param {Alias[]} n the new array
 * @param {string} parentID the ID of the parent of both the old and the new array
 * @returns {AliasChange[]} the changes from the old array to the new array
 */
function aliasDiff(o, n, parentID) {
    const { added, updated, removed } = (0, diff_arrays_of_objects_1.default)(o, n, 'internalID', {
        compareFunction: (a, b) => (a.equals(b)),
        updatedValues: diff_arrays_of_objects_1.default.updatedValues.both
    });
    const deletedChanges = removed.map((c) => ({
        action: 'remove',
        parentID,
        type: 'alias',
        old: c.toJSON()
    }));
    const addedChanges = added.map((c) => ({
        action: 'add',
        parentID,
        type: 'alias',
        new: c.toJSON()
    }));
    const updatedChanges = updated.map((c) => ({
        action: 'update',
        parentID,
        type: 'alias',
        old: c[0].toJSON(),
        new: c[1].toJSON()
    }));
    return [...addedChanges, ...updatedChanges, ...deletedChanges];
}
exports.aliasDiff = aliasDiff;
//# sourceMappingURL=diff.js.map