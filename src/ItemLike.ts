/* eslint-disable require-jsdoc */
import {
    Item as WikidataItem,
    Mediainfo as MediaItem
} from '@wmde/wikibase-datamodel-types';

import Label from './Label';
import Description from './Description';

export default abstract class ItemLike {
    abstract internalID: string;

    abstract pageid: number | undefined;

    abstract ns: number | undefined;

    abstract modified: Date | undefined;

    abstract type: 'item' | 'mediainfo';

    abstract id: string | undefined;

    abstract labels: Label[];

    abstract descriptions: Description[];

    /**
     * tries to find a label int the requested language.
     * if non can be found, it will return undefined
     *
     * @param {string} language the language of the label
     * @returns {Label | undefined} the labelA label if it found one or undefined
     * @example
     *      const label = item.findLabel("nl")
     *      console.log(label.value)
     *      // Douglas Adams
     */
    findLabel(language: string): Label | undefined {
        return this.labels.find((label) => label.language === language);
    }

    abstract toJSON(): WikidataItem | MediaItem;
}
