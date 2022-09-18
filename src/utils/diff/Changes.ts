import { AliasChange } from './aliasDiff';
import { DescriptionChange } from './descriptionDiff';
import { LabelChange } from './labelDiff';
import { SiteLinkChange } from './siteLinkDiff';
import { StatementChange } from './statementsDiff';

export type Changes = LabelChange | DescriptionChange | AliasChange | SiteLinkChange | StatementChange;
