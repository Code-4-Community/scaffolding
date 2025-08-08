import { Test, TestingModule } from '@nestjs/testing';
import { LabelsController } from './label.controller';
import { LabelsService } from './label.service';

// Mock implementation for LabelsService
const mockLabelService = {};

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
});
