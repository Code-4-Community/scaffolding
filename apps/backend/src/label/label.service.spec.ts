import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './types/label.entity';
import { LabelsService } from './label.service';
import { mockLabel, mockLabelDto } from './label.controller.spec';
import { BadRequestException } from '@nestjs/common';

const mockLabelsRepository = mock<Repository<Label>>();

describe('LabelService', () => {
  let service: LabelsService;

  const mockValidCreateLabelDTO = {
    name: 'Label 1',
    description: 'Desc 1',
    color: '#000000',
  };

  const mockInvalidCreateLabelDTO1 = {
    name: '',
    description: 'Desc 1',
    color: '#000000',
  };

  const mockInvalidCreateLabelDTO2 = {
    name: 'Label 2',
    description: 'Desc 2',
    color: '',
  };

  const mockInvalidCreateLabelDTO3 = {
    name: 'Label 3',
    description: 'Desc 3',
    color: 'Hello',
  };

  beforeEach(async () => {
    mockLabelsRepository.create.mockReset();
    mockLabelsRepository.save.mockReset();
    mockLabelsRepository.findOneBy.mockReset();
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
});
