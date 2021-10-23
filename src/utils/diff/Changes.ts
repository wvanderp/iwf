import { AliasChange } from './aliasDiff';
import { DescriptionChange } from './descriptionDiff';
import { LabelChange } from './labelDiff';
import { SiteLinkChange } from './siteLinkDiff';

export type Changes = LabelChange | DescriptionChange | AliasChange | SiteLinkChange;
