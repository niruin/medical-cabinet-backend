import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from './users/users.module';
import { databaseConfig } from './config/configuration';
import { SequelizeServiceConfig } from './config/sequelize.service.config';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeServiceConfig,
    }),
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    AuthModule,
    RolesModule,
    ScheduleModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
  ],
})
export class AppModule {}
