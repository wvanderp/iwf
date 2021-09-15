"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelDiff = void 0;
/**
 * @param {Label[]} o the old array
 * @param {Label[]} n the new array
 * @param parentID
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
                orig: label.toJSON()
            });
        }
        if (counterLabel !== undefined && label.value !== counterLabel.value) {
            changes.push({
                type: 'label',
                action: 'update',
                parentID,
                orig: label.toJSON(),
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
//# sourceMappingURL=diff.js.map