import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import {
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
  SignupResponse,
  ProfileResponse,
  UserChangeRequest,
  UserUpdateResponse,
  UsersAllResponse,
} from './types';
import { ChangeUserDto } from './dto/change-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: SignupResponse })
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return {
      status: 'success',
      message: 'Пользователь авторизован',
      data: {
        userId: req.user.userId,
      },
    };
  }

  @ApiOkResponse({ type: ProfileResponse })
  @Get('/profile')
  @UseGuards(AuthenticatedGuard)
  getProfile(@Request() req) {
    return this.usersService.profile({
      where: { email: req.user.email },
    });
  }

  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { status: 'success', message: 'Сессия завершена' };
  }

  @ApiBody({ type: UserChangeRequest })
  @ApiOkResponse({ type: UserUpdateResponse })
  @Patch('/update')
  @UseGuards(AuthenticatedGuard)
  update(@Request() req, @Body() updateUserDto: ChangeUserDto) {
    const userId = String(req.user.userId);
    return this.usersService.update(userId, updateUserDto);
  }

  @ApiOkResponse({ type: UsersAllResponse })
  @Get('/all')
  @UseGuards(AuthenticatedGuard)
  getUsersAll(@Request() req) {
    const userId = String(req.user.userId);
    return this.usersService.findAll(userId);
  }
}
