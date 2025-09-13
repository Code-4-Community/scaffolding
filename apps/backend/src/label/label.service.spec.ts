import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './types/label.entity';
import { LabelsService } from './label.service';
import { mockLabel } from './label.controller.spec';
import { BadRequestException } from '@nestjs/common';

const mockLabelsRepository = mock<Repository<Label>>();

describe('LabelService', () => {
  let service: LabelsService;

  const mockValidCreateLabelDTO = {
    name: 'Label 1',
    color: '#000000',
  };

  const mockInvalidCreateLabelDTO1 = {
    name: '',
    color: '#000000',
  };

  const mockInvalidCreateLabelDTO2 = {
    name: 'Label 2',
    color: '',
  };

  const mockInvalidCreateLabelDTO3 = {
    name: 'Label 3',
    color: 'Hello',
  };

  beforeEach(async () => {
    mockLabelsRepository.create.mockReset();
    mockLabelsRepository.save.mockReset();
    mockLabelsRepository.findOneBy.mockReset();
    mockLabelsRepository.findOne.mockReset();
    mockLabelsRepository.remove.mockReset();
    mockLabelsRepository.find.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabelsService,
        {
          provide: getRepositoryToken(Label),
          useValue: mockLabelsRepository,
        },
      ],
    }).compile();

    service = module.get<LabelsService>(LabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLabel', () => {
    it('should create a new label and return it', async () => {
      // Mock the repository methods
      mockLabelsRepository.create.mockReturnValue(mockLabel);
      mockLabelsRepository.save.mockResolvedValue(mockLabel);

      const label = await service.createLabel(mockValidCreateLabelDTO);

      expect(label).toEqual(mockLabel);
    });

    it('should throw a BadRequestException when given null label name', async () => {
      expect(async () => {
        await service.createLabel(mockInvalidCreateLabelDTO1);
      }).rejects.toThrow(
        new BadRequestException("The 'name' field cannot be null"),
      );
    });

    it('should throw a BadRequestException when given null label color', async () => {
      expect(async () => {
        await service.createLabel(mockInvalidCreateLabelDTO2);
      }).rejects.toThrow(
        new BadRequestException("The 'color' field cannot be null"),
      );
    });

    it('should throw a BadRequestException when given invalid label color', async () => {
      expect(async () => {
        await service.createLabel(mockInvalidCreateLabelDTO3);
      }).rejects.toThrow(
        new BadRequestException("The 'color' field must be a valid hex color"),
      );
    });
  });

  describe('getAllLabels', () => {
    it('should return an array of labels', async () => {
      mockLabelsRepository.find.mockResolvedValue([mockLabel]);

      const result = await service.getAllLabels();

      expect(result).toEqual([mockLabel]);
      expect(mockLabelsRepository.find).toHaveBeenCalled();
    });
  });

  describe('deleteLabel', () => {
    it('should delete a label and return success message', async () => {
      const labelId = 1;
      const expectedResponse = {
        success: true,
        message: `Label with ID ${labelId} deleted successfully`,
      };

      mockLabelsRepository.findOne.mockResolvedValue(mockLabel);
      mockLabelsRepository.remove.mockResolvedValue(mockLabel);

      const result = await service.deleteLabel(labelId);

      expect(result).toEqual(expectedResponse);
      expect(mockLabelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: labelId },
      });
      expect(mockLabelsRepository.remove).toHaveBeenCalledWith(mockLabel);
    });

    it('should throw BadRequestException when label does not exist', async () => {
      const labelId = 999;
      mockLabelsRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteLabel(labelId)).rejects.toThrow(
        new BadRequestException(`Label with ID ${labelId} does not exist`),
      );

      expect(mockLabelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: labelId },
      });
      expect(mockLabelsRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('updateLabel', () => {
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

      mockLabelsRepository.findOne.mockResolvedValue(mockLabel);
      mockLabelsRepository.save.mockResolvedValue(updatedLabel);

      const result = await service.updateLabel(labelId, updateLabelDto);

      expect(result).toEqual(updatedLabel);
      expect(mockLabelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: labelId },
      });
      expect(mockLabelsRepository.save).toHaveBeenCalledWith(updatedLabel);
    });

    it('should throw BadRequestException when label does not exist', async () => {
      const labelId = 999;
      const updateLabelDto = {
        name: 'Updated Label',
        color: '#ffffff',
      };

      mockLabelsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateLabel(labelId, updateLabelDto),
      ).rejects.toThrow(
        new BadRequestException(`Label with ID ${labelId} does not exist`),
      );

      expect(mockLabelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: labelId },
      });
      expect(mockLabelsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when color is invalid', async () => {
      const labelId = 1;
      const updateLabelDto = {
        name: 'Updated Label',
        color: 'invalid-color',
      };

      mockLabelsRepository.findOne.mockResolvedValue(mockLabel);

      await expect(
        service.updateLabel(labelId, updateLabelDto),
      ).rejects.toThrow(
        new BadRequestException("The 'color' field must be a valid hex color"),
      );

      expect(mockLabelsRepository.findOne).toHaveBeenCalledWith({
        where: { id: labelId },
      });
      expect(mockLabelsRepository.save).not.toHaveBeenCalled();
    });
  });
});
