import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { RolesResponse } from './types/roles.types';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({ type: [RolesResponse] })
  @Get('/all')
  rolesAll() {
    return this.rolesService.findAll();
  }
}
