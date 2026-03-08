import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryDraftDto } from './create-story-draft.dto';

export class UpdateStoryDraftDto extends PartialType(CreateStoryDraftDto) {}
