import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  // @ApiProperty({ example: 1 })
  // readonly userId: number;

  @ApiProperty({ example: 1 })
  readonly doctorId: number;

  // @ApiProperty({ example: 'Простуда' })
  // readonly diagnosis: string;
  //
  // @ApiProperty({ example: 'Комметарий' })
  // readonly comments: string;

  @ApiProperty({
    example: 'Sat May 20 2023 11:00:40 GMT+0300 (Москва, стандартное время)',
  })
  readonly date: string;
}
