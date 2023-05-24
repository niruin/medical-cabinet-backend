import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeRoleUserDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ example: 'Админ' })
  @IsNotEmpty()
  readonly role: string;
}
