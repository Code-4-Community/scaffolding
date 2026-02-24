import { IsString, IsInt, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionRound, EditRound } from '../types';

export class CreateStoryDraftDto {
  @ApiProperty({ description: 'ID of the author' })
  @IsInt()
  authorId: number;

  @ApiProperty({ description: 'Link to the document' })
  @IsString()
  docLink: string;

  @ApiProperty({
    description: 'Submission round',
    enum: SubmissionRound,
    example: SubmissionRound.ONE,
  })
  @IsEnum(SubmissionRound)
  submissionRound: SubmissionRound;

  @ApiProperty({ description: 'Whether the student has given consent' })
  @IsBoolean()
  studentConsent: boolean;

  @ApiProperty({ description: 'Whether the story is in the manuscript' })
  @IsBoolean()
  inManuscript: boolean;

  @ApiProperty({
    description: 'Edit round',
    enum: EditRound,
    example: EditRound.ONE,
  })
  @IsEnum(EditRound)
  editRound: EditRound;

  @ApiProperty({ description: 'Whether the story has been proofread' })
  @IsBoolean()
  proofread: boolean;

  @ApiProperty({ description: 'Notes about the story draft', type: [String] })
  @IsArray()
  @IsString({ each: true })
  notes: string[];
}
