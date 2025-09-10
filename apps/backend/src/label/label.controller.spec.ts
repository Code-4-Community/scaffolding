import { Test, TestingModule } from '@nestjs/testing';
import { LabelsController } from './label.controller';
import { LabelsService } from './label.service';
import { CreateLabelDTO } from './dtos/create-label.dto';
import { Label } from './types/label.entity';
import { UpdateSingleLabelDTO } from './dtos/update-single-label.dto';

// Mock implementation for LabelsService
export const mockLabelService: Partial<LabelsService> = {
  createLabel: jest.fn((labelDto: CreateLabelDTO) =>
    Promise.resolve(mockLabel),
  ),
  getAllLabels: jest.fn(() => Promise.resolve([mockLabel])),
  deleteLabel: jest.fn((labelId: number) =>
    Promise.resolve({
      success: true,
      message: `Label with ID ${labelId} deleted successfully`,
    }),
  ),
  updateLabel: jest.fn(
    (labelId: number, updateLabelDto: UpdateSingleLabelDTO) =>
      Promise.resolve(mockLabel),
  ),
};

export const mockLabelDto: CreateLabelDTO = {
  name: 'Test Label',
  color: '#000000',
};

export const mockLabel: Label = {
  id: 1,
  name: 'Test Label',
  color: '#000000',
  tasks: [],
};

export const mockLabel2: Label = {
  id: 2,
  name: 'Test Label 2',
  color: '#802b2bff',
  tasks: [],
};

describe('LabelController', () => {
  let controller: LabelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelsController],
      providers: [
        {
          provide: LabelsService,
          useValue: mockLabelService,
        },
      ],
    }).compile();

    controller = module.get<LabelsController>(LabelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /labels', () => {
    it('should create a new label and return it', async () => {
      jest.spyOn(mockLabelService, 'createLabel').mockResolvedValue(mockLabel);

      const res = await controller.createLabel(mockLabelDto);

      expect(res).toEqual(mockLabel);
      expect(mockLabelService.createLabel).toHaveBeenCalledWith(mockLabelDto);
    });
  });

  describe('GET /labels', () => {
    it('should return an array of labels', async () => {
      jest
        .spyOn(mockLabelService, 'getAllLabels')
        .mockResolvedValue([mockLabel]);

      const res = await controller.getAllLabels();

      expect(res).toEqual([mockLabel]);
      expect(mockLabelService.getAllLabels).toHaveBeenCalled();
    });
    it('should return an array of labels with 2 labels', async () => {
      jest
        .spyOn(mockLabelService, 'getAllLabels')
        .mockResolvedValue([mockLabel, mockLabel2]);

      const res = await controller.getAllLabels();

      expect(res).toEqual([mockLabel, mockLabel2]);
      expect(mockLabelService.getAllLabels).toHaveBeenCalled();
    });
  });

  describe('DELETE /labels/:labelId', () => {
    it('should delete a label and return success message', async () => {
      const labelId = 1;
      const expectedResponse = {
        success: true,
        message: `Label with ID ${labelId} deleted successfully`,
      };

      jest
        .spyOn(mockLabelService, 'deleteLabel')
        .mockResolvedValue(expectedResponse);

      const res = await controller.deleteLabel(labelId);

      expect(res).toEqual(expectedResponse);
      expect(mockLabelService.deleteLabel).toHaveBeenCalledWith(labelId);
    });
  });

  describe('PATCH /labels/:labelId/edit', () => {
    it('should update a label and return the updated label', async () => {
      const labelId = 1;
      const updateLabelDto = {
        name: 'Updated Label',
        color: '#ffffff',
      };
      const updatedLabel = {
        ...mockLabel,
        name: 'Updated Label',
        color: '#ffffff',
      };

      jest
        .spyOn(mockLabelService, 'updateLabel')
        .mockResolvedValue(updatedLabel);

      const res = await controller.updateLabel(labelId, updateLabelDto);

      expect(res).toEqual(updatedLabel);
      expect(mockLabelService.updateLabel).toHaveBeenCalledWith(
        labelId,
        updateLabelDto,
      );
    });
  });
});
