import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from './models/roles.model';
import { Roles } from './enums/roles.enums';
import { RolesFilter } from './types/roles.types';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async findAll(): Promise<Role[]> {
    const existingRoles = await this.roleModel.findAll();

    if (existingRoles.length === 0) {
      await this.roleModel.bulkCreate([
        { name: Roles.USER },
        { name: Roles.PATIENT },
        { name: Roles.DOCTOR },
        { name: Roles.ADMIN },
      ]);
    }
    return this.roleModel.findAll();
  }

  findOne(filter: RolesFilter): Promise<Role> {
    return this.roleModel.findOne(filter);
  }
}
