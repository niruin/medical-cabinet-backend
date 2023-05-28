import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
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
  @Get('/list')
  @UseGuards(AuthenticatedGuard)
  list(@Query('doctorId') doctorId: string, @Request() req) {
    const userId = String(req.user.userId);
    return this.scheduleService.list(userId, doctorId);
  }

  constructor(private readonly scheduleService: ScheduleService) {}
  @Post('/create')
  @UseGuards(AuthenticatedGuard)
  create(@Request() req, @Body() createScheduleDto: CreateScheduleDto) {
    const reqUserId = req.user.userId;
    return this.scheduleService.create(reqUserId, createScheduleDto);
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
