import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from './users.controller';
import { User } from './models/users.model';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [RolesModule, DoctorsModule, SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
