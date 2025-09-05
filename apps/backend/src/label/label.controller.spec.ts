import { Test, TestingModule } from '@nestjs/testing';
import { LabelsController } from './label.controller';
import { LabelsService } from './label.service';
import { CreateLabelDTO } from './dtos/create-label.dto';
import { Label } from './types/label.entity';

// Mock implementation for LabelsService
export const mockLabelService: Partial<LabelsService> = {
  createLabel: jest.fn((labelDto: CreateLabelDTO) =>
    Promise.resolve(mockLabel),
  ),
  getAllLabels: jest.fn(() => Promise.resolve([mockLabel])),
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

  /* Test for create new label */
  describe('POST /labels', () => {
    it('should create a new label and return it', async () => {
      jest.spyOn(mockLabelService, 'createLabel').mockResolvedValue(mockLabel);

      const res = await controller.createLabel(mockLabelDto);

      expect(res).toEqual(mockLabel);
      expect(mockLabelService.createLabel).toHaveBeenCalledWith(mockLabelDto);
    });
  });

  /* Test for retrieve all labels */
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
});
