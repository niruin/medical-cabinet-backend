import { ApiProperty } from '@nestjs/swagger';

import { Roles } from '../enums/roles.enums';

export class RolesResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Admin' })
  name: Roles.PATIENT | Roles.USER | Roles.DOCTOR | Roles.ADMIN;
}

export type RolesFilter = {
  where: { id?: number; name?: string };
};
