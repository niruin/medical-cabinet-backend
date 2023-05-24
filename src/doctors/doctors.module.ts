import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DoctorsService } from './doctors.service';
import { Doctor } from './models/doctors.model';
import { DoctorsController } from './doctors.controller';

@Module({
  imports: [SequelizeModule.forFeature([Doctor])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
