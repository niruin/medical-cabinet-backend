import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

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
import { ChangeRoleUserDto } from './dto/change-role-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: ProfileResponse })
  @Get('/profile')
  @UseGuards(AuthenticatedGuard)
  getProfile(@Request() req) {
    return this.usersService.profile({
      where: { email: req.user.email },
    });
  }
  @ApiOkResponse({ type: UsersAllResponse })
  @Get('/all')
  @UseGuards(AuthenticatedGuard)
  getUsersAll(@Request() req) {
    const userId = String(req.user.userId);
    return this.usersService.findAll(userId);
  }

  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { status: 'success', message: 'Сессия завершена' };
  }

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

  @ApiBody({ type: UserChangeRequest })
  @ApiOkResponse({ type: UserUpdateResponse })
  @ApiQuery({
    name: 'userIdToEdit',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  @Patch('/update')
  @UseGuards(AuthenticatedGuard)
  update(
    @Query('userIdToEdit') userIdToEdit: string,
    @Request() req,
    @Body() updateUserDto: ChangeUserDto,
  ) {
    const currentUserId = String(req.user.userId);
    return this.usersService.update(currentUserId, updateUserDto, userIdToEdit);
  }

  @Patch('/change-role')
  @UseGuards(AuthenticatedGuard)
  changeRole(@Request() req, @Body() changeRoleUserDto: ChangeRoleUserDto) {
    const userIdReq = String(req.user.userId);
    return this.usersService.changeRole(userIdReq, changeRoleUserDto);
  }
}
