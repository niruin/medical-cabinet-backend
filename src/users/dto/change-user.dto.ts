import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeUserDto {
  @ApiProperty({ example: 'example@mail.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Ivan' })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Ivanovich' })
  @IsNotEmpty()
  readonly middleName: string;

  @ApiProperty({ example: 'Ivanov' })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ example: '12/04/99' })
  @IsNotEmpty()
  readonly birthDate: string;

  @ApiProperty({ example: '180' })
  @IsNotEmpty()
  readonly height: string;

  @ApiProperty({ example: '80' })
  @IsNotEmpty()
  readonly weight: string;

  @ApiProperty({ example: 'male' })
  @IsNotEmpty()
  readonly gender: string;
}
