import { ApiProperty } from '@nestjs/swagger';

const schedulePersonExample: SchedulePerson = {
  firstName: 'Иван',
  middleName: 'Иванович',
  lastName: 'Иванов',
};

export class ScheduleRemoveOneRequest {
  @ApiProperty({ example: '1' })
  id: string;
}

class SchedulePerson {
  @ApiProperty({ example: 'Иван' })
  firstName: string;
  @ApiProperty({ example: 'Иванович' })
  middleName: string;
  @ApiProperty({ example: 'Иванов' })
  lastName: string;
}

class Schedule {
  @ApiProperty({ example: '1' })
  event_id: string;

  @ApiProperty({ example: 'Простуда' })
  diagnosis: string;

  @ApiProperty({ example: 'Комметарий' })
  comments: string;

  @ApiProperty({
    example: 'Sat May 20 2023 10:00:40 GMT+0300 (Москва, стандартное время)',
  })
  startDate: Date;

  @ApiProperty({
    example: 'Sat May 20 2023 11:00:40 GMT+0300 (Москва, стандартное время)',
  })
  endDate: Date;

  @ApiProperty({
    example: 'title',
  })
  title: string;

  @ApiProperty({ type: SchedulePerson, example: schedulePersonExample })
  patient: SchedulePerson;

  @ApiProperty({ type: SchedulePerson, example: schedulePersonExample })
  doctor: SchedulePerson;
}

export class ScheduleListResponse {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Пользователь авторизован' })
  message: string;

  @ApiProperty({
    type: [Schedule],
  })
  data: [Schedule];
}
