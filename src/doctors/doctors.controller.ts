import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { DoctorsService } from './doctors.service';
import { DoctorListResponse } from './types/doctors.types';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiOkResponse({ type: DoctorListResponse })
  @Get('/list')
  @UseGuards(AuthenticatedGuard)
  doctorList() {
    return this.doctorsService.findAll();
  }
}
