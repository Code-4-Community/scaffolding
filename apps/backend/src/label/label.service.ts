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
    if (!labelDto.name) {
      throw new BadRequestException("The 'name' field cannot be null");
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

  // Retrieves all labels
  async getAllLabels(): Promise<Label[]> {
    return this.labelRepository.find({ relations: ['tasks'] });
  }

  async deleteLabel(
    labelId: number,
  ): Promise<{ success: boolean; message: string }> {
    const label = await this.labelRepository.findOne({
      where: { id: labelId },
    });
    if (!label) {
      throw new BadRequestException(`Label with ID ${labelId} does not exist`);
    }

    await this.labelRepository.remove(label);
    return {
      success: true,
      message: `Label with ID ${labelId} deleted successfully`,
    };
  }

  async updateLabel(
    labelId: number,
    updateLabelDto: Partial<CreateLabelDTO>,
  ): Promise<Label> {
    const label = await this.labelRepository.findOne({
      where: { id: labelId },
    });
    if (!label) {
      throw new BadRequestException(`Label with ID ${labelId} does not exist`);
    }

    if (updateLabelDto.color && !isHexColor(updateLabelDto.color)) {
      throw new BadRequestException(
        "The 'color' field must be a valid hex color",
      );
    }

    Object.assign(label, updateLabelDto);
    return this.labelRepository.save(label);
  }
}
