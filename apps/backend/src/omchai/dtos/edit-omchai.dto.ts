import { PartialType } from '@nestjs/swagger';
import { CreateOmchaiDto } from './create-omchai.dto';

export class EditOmchaiDto extends PartialType(CreateOmchaiDto) {}
