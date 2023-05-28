import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 1 })
  readonly userId: number;

  @ApiProperty({ example: 1 })
  readonly doctorId: number;

  @ApiProperty({ example: 'Простуда', required: false })
  readonly diagnosis: string;

  @ApiProperty({ example: 'Комметарий', required: false })
  readonly comments: string;

  @ApiProperty({
    example: 'Sat May 20 2023 11:00:40 GMT+0300 (Москва, стандартное время)',
  })
  readonly startDate: Date;

  @ApiProperty({
    example: 'Sat May 20 2023 11:00:40 GMT+0300 (Москва, стандартное время)',
  })
  readonly endDate: Date;
}
