import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@mail.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'qwerty123' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'Ivan' })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Ivanovich' })
  @IsNotEmpty()
  readonly middleName: string;

  @ApiProperty({ example: 'Ivanov' })
  @IsNotEmpty()
  readonly lastName: string;
}
