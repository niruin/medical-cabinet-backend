import { ApiProperty } from '@nestjs/swagger';

import { Roles } from '../../roles/enums/roles.enums';

const loginUserResponseExample = {
  user: {
    userId: 1,
  },
};

export class LoginUserRequest {
  @ApiProperty({ example: 'example@mail.com' })
  email: string;

  @ApiProperty({ example: 'qwerty123' })
  password: string;
}

class LoginUserResponseExampleData {
  @ApiProperty()
  userId: number;
}

export class LoginUserResponse {
  @ApiProperty({ example: 'success' })
  status: StatusText;

  @ApiProperty({ example: 'Пользователь авторизован' })
  message: string;

  @ApiProperty({
    example: loginUserResponseExample,
    type: LoginUserResponseExampleData,
  })
  data: LoginUserResponseExampleData;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'success' })
  status: StatusText;

  @ApiProperty({ example: 'Сессия завершена' })
  message: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;
}

type StatusText = 'success' | 'error';

class SignupResponseData {
  @ApiProperty({ example: 1 })
  userId: number;
}

export class SignupResponse {
  @ApiProperty({ example: 'success' })
  status: StatusText;

  @ApiProperty({ example: 'Пользователь зарегистрирован' })
  message: string;

  @ApiProperty()
  data: SignupResponseData;
}

export class ProfileResponseData {
  @ApiProperty({ example: 1 }) id: number;

  @ApiProperty({ example: 'example@gmail.com' }) email: string;

  @ApiProperty({ example: 'Ivan' }) firstName: string;

  @ApiProperty({ example: 'Ivanovich' }) middleName: string;

  @ApiProperty({ example: 'Ivanov' }) lastName: string;

  @ApiProperty({ example: '12/04/94' }) birthDate: string;

  @ApiProperty({ example: '180' }) height: string;

  @ApiProperty({ example: '80' }) weight: string;

  @ApiProperty({ example: 'male' }) gender: string;

  @ApiProperty({ example: Roles.USER }) role: Roles.USER;

  @ApiProperty({ example: '2023-03-17T17:23:33.502Z' }) updatedAt: string;

  @ApiProperty({ example: '2023-03-17T17:23:33.502Z' }) createdAt: string;
}

export class ProfileResponse {
  @ApiProperty({ example: 'success' })
  status: StatusText;

  @ApiProperty({ example: 'Профиль пользователя' })
  message: string;

  @ApiProperty({ type: ProfileResponseData })
  data: ProfileResponseData;
}

export class UserChangeRequest {
  @ApiProperty({ example: 'example@gmail.com' }) email: string;

  @ApiProperty({ example: 'Ivan' }) firstName: string;

  @ApiProperty({ example: 'Ivanovich' }) middleName: string;

  @ApiProperty({ example: 'Ivanov' }) lastName: string;

  @ApiProperty({ example: '12/04/94' }) birthDate: string;

  @ApiProperty({ example: '180' }) height: string;

  @ApiProperty({ example: '80' }) weight: string;

  @ApiProperty({ example: 'male' }) gender: string;

  @ApiProperty({ example: Roles.USER }) role: Roles.USER;
}

export class UserUpdateResponse {
  @ApiProperty({ example: 'success' })
  status: StatusText;

  @ApiProperty({ example: 'Изменения сохранены' })
  message: string;
}

export class UsersAllResponse {
  @ApiProperty({ example: 'success' })
  status: StatusText;

  @ApiProperty({ example: 'Список пользователей получен' })
  message: string;

  @ApiProperty({ type: [ProfileResponse] })
  data: [ProfileResponse];
}

export type UsersFilter = {
  where: { id?: string; email?: string };
};
