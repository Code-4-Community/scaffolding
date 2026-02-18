import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerInfoController } from './volunteer-info.controller';
import { VolunteerInfoService } from './volunteer-info.service';
import { VolunteerInfo } from './volunteer-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VolunteerInfo])],
  controllers: [VolunteerInfoController],
  providers: [VolunteerInfoService],
})
export class VolunteerInfoModule {}
