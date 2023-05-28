import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('/list')
  @UseGuards(AuthenticatedGuard)
  list(@Request() req) {
    const userId = String(req.user.userId);
    return this.patientsService.findAll(userId);
  }
}
