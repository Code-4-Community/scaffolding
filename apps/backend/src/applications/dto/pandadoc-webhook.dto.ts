import { IsString, IsObject, IsOptional, IsArray } from 'class-validator';

export class PandaDocField {
  @IsString()
  uuid: string;

  @IsString()
  name: string;

  @IsOptional()
  value?: unknown;

  @IsString()
  @IsOptional()
  title?: string;
}

export class PandaDocRecipient {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;
}

export class PandaDocData {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  fields?: PandaDocField[];

  @IsArray()
  @IsOptional()
  recipients?: PandaDocRecipient[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class PandaDocWebhookDto {
  @IsString()
  event: string;

  @IsObject()
  data: PandaDocData;
}
