import { ApiProperty } from '@nestjs/swagger';

export class ScheduleRemoveOneRequest {
  @ApiProperty({ example: '1' })
  id: string;
}

class SchedulePerson {
  firstName: string;
  middleName: string;
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
    example: 'Sat May 20 2023 11:00:40 GMT+0300 (Москва, стандартное время)',
  })
  date: string;

  @ApiProperty({ type: SchedulePerson })
  patient: SchedulePerson;

  @ApiProperty({ type: SchedulePerson })
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
