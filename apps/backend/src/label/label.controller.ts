import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LabelsService } from './label.service';
import { Label } from './types/label.entity';
import { CreateLabelDTO } from './dtos/create-label.dto';
import { UpdateSingleLabelDTO } from './dtos/update-single-label.dto';

@ApiTags('labels')
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  /** Creates a new label.
   * @param LabelDto - The data transfer object containing label details.
   * @returns The created label.
   * @throws BadRequestException if the label name is not unique
   * @throws BadRequestException if label name is not provided
   * @throws BadRequestException if color is not provided or is not hexadecimal
   */
  @Post('/label')
  async createLabel(@Body() labelDto: CreateLabelDTO): Promise<Label> {
    return this.labelsService.createLabel(labelDto);
  }

  /** Gets all labels.
   * @returns An array of all labels.
   */
  @Get()
  async getAllLabels(): Promise<Label[]> {
    return this.labelsService.getAllLabels();
  }

  /** Deletes a label by its id.
   * @param labelId - The ID of the label to delete.
   * @returns A boolean indicating success and a message.
   * @throws BadRequestException if the label with the given ID does not exist.
   */
  @Delete('/:labelId')
  async deleteLabel(
    @Param('labelId') labelId: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.labelsService.deleteLabel(labelId);
  }

  /** Updates a label by its id.
   * @param labelId - The ID of the label to delete.
   * @param updateLabelDto - The data transfer object containing updated label details.
   * @returns The updated label.
   * @throws BadRequestException if the label with the given ID does not exist.
   * @throws BadRequestException if the color is not hexadecimal.
   */
  @Patch('/:labelId/edit')
  async updateLabel(
    @Param('labelId') labelId: number,
    @Body() updateLabelDto: UpdateSingleLabelDTO,
  ): Promise<Label> {
    return this.labelsService.updateLabel(labelId, updateLabelDto);
  }
}
