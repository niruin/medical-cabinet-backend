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

  async existenceСheck() {
    const existingRoles = await this.roleModel.findAll();

    if (existingRoles.length === 0) {
      await this.roleModel.bulkCreate([
        { name: Roles.USER },
        { name: Roles.PATIENT },
        { name: Roles.DOCTOR },
        { name: Roles.ADMIN },
      ]);
    }
  }

  async findAll(): Promise<Role[]> {
    await this.existenceСheck();
    return this.roleModel.findAll({ raw: true });
  }

  async findOne(filter: RolesFilter): Promise<Role> {
    await this.existenceСheck();
    return this.roleModel.findOne(filter);
  }
}
