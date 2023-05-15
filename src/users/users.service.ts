import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './models/users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersFilter } from './types';
import { Roles } from '../roles/enums/roles.enums';
import { RolesService } from '../roles/roles.service';
import { ChangeUserDto } from './dto/change-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private readonly roleService: RolesService,
  ) {}

  findOne(filter: UsersFilter): Promise<any> {
    return this.userModel.findOne({ ...filter });
  }

  async profile(filter: UsersFilter): Promise<any> {
    const user = await this.userModel.findOne({ ...filter });
    const role = await this.roleService.findOne({ where: { id: user.roleId } });

    return {
      status: 'success',
      message: 'Профиль пользователя',
      data: { ...user.dataValues, role: role.name },
    };
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<any | { warningMessage: string }> {
    const user = new User();
    const existingByEmail = await this.findOne({
      where: { email: createUserDto.email },
    });

    if (existingByEmail) {
      return { warningMessage: 'Пользователь с таким email уже существует' };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const roleUser = await this.roleService.findOne({
      where: { name: Roles.USER },
    });

    user.password = hashedPassword;
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.middleName = createUserDto.middleName;
    user.lastName = createUserDto.lastName;
    user.roleId = roleUser.id;

    const newUser = await user.save();

    return {
      status: 'success',
      message: 'Пользователь зарегистрирован',
      data: {
        userId: newUser.id,
      },
    };
  }

  async update(userId: string, changeUser: ChangeUserDto): Promise<any> {
    const user = await this.findOne({
      where: { id: userId },
    });

    await this.userModel.update(
      { ...user.dataValues, ...changeUser },
      {
        where: {
          id: userId,
        },
      },
    );

    return {
      status: 'success',
      message: 'Изменения сохранены',
    };
  }

  async findAll(userId: string) {
    const user = await this.findOne({ where: { id: userId } });

    if (user.roleId !== 4) {
      throw new ForbiddenException();
    }

    const userList = await this.userModel.findAll();

    return {
      status: 'success',
      message: 'Список пользователей получен',
      data: userList,
    };
  }
}