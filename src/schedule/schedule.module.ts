import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from './models/schedule.model';
import { UsersModule } from '../users/users.module';
import { PatientsModule } from '../patients/patients.module';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    UsersModule,
    PatientsModule,
    DoctorsModule,
    SequelizeModule.forFeature([Schedule]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
