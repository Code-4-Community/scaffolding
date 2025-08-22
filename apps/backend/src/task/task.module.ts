import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { Task } from './types/task.entity';
import { Label } from '../label/types/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Label])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}
