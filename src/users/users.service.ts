import {
  Injectable,
  ForbiddenException,
  RequestMappingMetadata,
  RequestMethod,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './models/users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersFilter } from './types';
import { Roles } from '../roles/enums/roles.enums';
import { RolesService } from '../roles/roles.service';
import { ChangeUserDto } from './dto/change-user.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { ChangeRoleUserDto } from './dto/change-role-user.dto';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly roleService: RolesService,
    private readonly doctorService: DoctorsService,
    private readonly patientService: PatientsService,
  ) {}

  findOne(filter: UsersFilter): Promise<any> {
    return this.userModel.findOne({ ...filter });
  }

  async remove(reqUserId: string, removeUserId: number): Promise<any> {
    const userReq = await this.userModel.findOne({ where: { id: reqUserId } });

    if (userReq.roleId !== 4 && userReq.id !== removeUserId) {
      throw new ForbiddenException();
    }

    const userRemove = await this.userModel.findOne({ where: { id: removeUserId } });

    if (userRemove.roleId === 2) {
      await this.patientService.remove(removeUserId);
    } else if (userRemove.roleId === 3) {
      await this.doctorService.remove(removeUserId);
    }

    await this.userModel.destroy({
      where: {
        id: removeUserId,
      },
    });

    return { status: 'success', message: 'Пользователь удален из системы' };
  }

  async profile(filter: UsersFilter): Promise<any> {
    const user = await this.userModel.findOne({ ...filter });
    const role = await this.roleService.findOne({ where: { id: user.roleId } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restUser } = user.dataValues;

    return {
      status: 'success',
      message: 'Профиль пользователя',
      data: { ...restUser, role: role.name },
    };
  }

  async create(createUserDto: CreateUserDto): Promise<any | { warningMessage: string }> {
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

  async update(userIdReq: string, changeDataUser: ChangeUserDto): Promise<any> {
    const userReqFilter = { where: { id: userIdReq } };
    const userReq = await this.findOne(userReqFilter);

    const isAdmin = userReq.roleId === 4;
    const isSelfEdit = Number(userIdReq) === changeDataUser.id;

    if (!isAdmin) {
      if (!isSelfEdit) {
        throw new ForbiddenException();
      }
    }

    await this.userModel.update(
      { ...changeDataUser },
      {
        where: {
          id: changeDataUser.id,
        },
      },
    );

    return {
      status: 'success',
      message: 'Изменения сохранены',
    };
  }

  async changerRoleAdminAccess(
    userIdReq: string,
    changeRoleUserDto: ChangeRoleUserDto,
  ): Promise<any> {
    const userReqFilter = { where: { id: userIdReq } };
    const userReq = await this.findOne(userReqFilter);

    if (userReq.roleId !== 4) throw new ForbiddenException();

    return await this.changeRole(changeRoleUserDto);
  }

  async changeRole(changeRoleUserDto: ChangeRoleUserDto): Promise<any> {
    const patchUserFilter = { where: { id: String(changeRoleUserDto.id) } };
    const patchUser = await this.findOne(patchUserFilter);

    const roleToPatchFilter = { where: { name: changeRoleUserDto.role } };
    const roleToPatch = await this.roleService.findOne(roleToPatchFilter);

    // action for previous role
    switch (patchUser.roleId) {
      case 2:
        await this.patientService.remove(patchUser.id);
        break;
      case 3:
        await this.doctorService.remove(patchUser.id);
        break;
      default:
        break;
    }

    // action for new role
    switch (roleToPatch.id) {
      case 2:
        await this.patientService.create(patchUser.id);
        break;
      case 3:
        await this.doctorService.create(patchUser.id);
        break;
      default:
        break;
    }

    await this.userModel.update(
      { roleId: roleToPatch.id },
      {
        where: {
          id: patchUser.id,
        },
      },
    );

    return {
      status: 'success',
      message: 'Изменения сохранены',
    };
  }

  async getUserList(options) {
    return await this.userModel.findAll(options);
  }

  async findAll(userId: string): Promise<any> {
    const user = await this.findOne({ where: { id: userId } });
    const roles = await this.roleService.findAll();

    if (user.roleId !== 4) {
      throw new ForbiddenException();
    }

    const options = {
      attributes: [
        `id`,
        `email`,
        `firstName`,
        `middleName`,
        `lastName`,
        `birthDate`,
        `height`,
        `weight`,
        `gender`,
        `roleId`,
        `updatedAt`,
        `createdAt`,
      ],
      raw: true,
    };

    const userList = await this.getUserList(options);

    const formattedUserList = userList.map((user) => {
      return {
        ...user,
        role: roles.find((role) => role.id === user.roleId).name,
      };
    });

    return {
      status: 'success',
      message: 'Список пользователей получен',
      data: formattedUserList,
    };
  }
}
