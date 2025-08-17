import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './types/label.entity';
import { CreateLabelDTO } from './dtos/create-label.dto';
import { isHexColor } from 'class-validator';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  // Creates a new label
  async createLabel(labelDto: CreateLabelDTO): Promise<Label> {
    if (!labelDto.title) {
      throw new BadRequestException("The 'title' field cannot be null");
    }

    if (!labelDto.color) {
      throw new BadRequestException("The 'color' field cannot be null");
    }

    if (!isHexColor(labelDto.color)) {
      throw new BadRequestException(
        "The 'color' field must be a valid hex color",
      );
    }

    const newLabel = this.labelRepository.create(labelDto);
    return this.labelRepository.save(newLabel);
  }
}
