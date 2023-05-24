import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';
import { ChangeScheduleDto } from './dto/change-schedule.dto';
import { ScheduleRemoveOneRequest } from './types';
import { ScheduleListResponse } from './types/schedule.types';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  @ApiOkResponse({ type: ScheduleListResponse })
  @Get('/patient')
  @UseGuards(AuthenticatedGuard)
  patientList(@Request() req) {
    const userId = String(req.user.userId);
    return this.scheduleService.patientList(userId);
  }

  @ApiOkResponse({ type: ScheduleListResponse })
  @Get('/doctor')
  @UseGuards(AuthenticatedGuard)
  doctorList(@Request() req) {
    const userId = String(req.user.userId);
    return this.scheduleService.doctorList(userId);
  }
  constructor(private readonly scheduleService: ScheduleService) {}
  @Post('/create')
  @UseGuards(AuthenticatedGuard)
  create(@Request() req, @Body() createScheduleDto: CreateScheduleDto) {
    const userId = req.user.userId;
    return this.scheduleService.create(userId, createScheduleDto);
  }

  @Patch('/update')
  @UseGuards(AuthenticatedGuard)
  update(@Request() req, @Body() changeScheduleDto: ChangeScheduleDto) {
    const userId = String(req.user.userId);
    return this.scheduleService.update(userId, changeScheduleDto);
  }

  @Delete('/delete')
  @UseGuards(AuthenticatedGuard)
  remove(@Request() req, @Body() { id }: ScheduleRemoveOneRequest) {
    const userId = String(req.user.userId);
    return this.scheduleService.remove({
      where: {
        id: id,
      },
    });
  }
}
