import { ApiProperty } from '@nestjs/swagger';

class Doctor {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Иван' })
  firstName: string;

  @ApiProperty({ example: 'Иванович' })
  middleName: string;

  @ApiProperty({ example: 'Иванов' })
  lastName: string;
}

export class DoctorListResponse {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Список врачей получен' })
  message: string;

  @ApiProperty({
    type: [Doctor],
  })
  data: [Doctor];
}
