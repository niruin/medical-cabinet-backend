import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './models/patients.model';

@Module({
  imports: [SequelizeModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
