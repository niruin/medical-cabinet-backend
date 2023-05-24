import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

import { User } from '../users/models/users.model';
import { EnumConfig } from './enum.config';
import { Role } from '../roles/models/roles.model';
import { Schedule } from '../schedule/models/schedule.model';
import { Patient } from '../patients/models/patients.model';
import { Doctor } from '../doctors/models/doctors.model';

@Injectable()
export class SequelizeServiceConfig implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const {
      pg: { dialect, logging, host, port, username, password, database },
    } = this.configService.get(EnumConfig.DATABASE);

    return {
      dialect,
      logging,
      host,
      port,
      username,
      password,
      database,
      models: [Role, User, Schedule, Doctor, Patient],
      autoLoadModels: true,
      synchronize: true,
    };
  }
}
