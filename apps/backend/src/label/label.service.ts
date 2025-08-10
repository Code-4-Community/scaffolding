import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './types/label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  // Creates a new label
}
