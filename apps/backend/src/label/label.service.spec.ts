import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './types/label.entity';
import { LabelsService } from './label.service';

const mockLabelsRepository = mock<Repository<Label>>();

describe('LabelService', () => {
  let service: LabelsService;

  beforeEach(async () => {
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

  /* Tests for create new label */
});
