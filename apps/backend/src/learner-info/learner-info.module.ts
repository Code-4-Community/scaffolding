import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearnerInfoController } from './learner-info.controller';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LearnerInfo])],
  controllers: [LearnerInfoController],
  providers: [LearnerInfoService],
})
export class LearnerInfoModule {}
