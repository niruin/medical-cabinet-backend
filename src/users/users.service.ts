import { Injectable, ForbiddenException } from '@nestjs/common';
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
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private readonly roleService: RolesService,
    private readonly doctorService: DoctorsService,
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

  async update(
    currentUserId: string,
    changeDataUser: ChangeUserDto,
    //TODO удалить
    userIdToEdit?: string,
  ): Promise<any> {
    // const user = await this.findOne({
    //   where: { id: currentUserId },
    // });

    // const userData = await this.findOne({
    //   where: { id: String(changeDataUser.id) },
    // });

    // const { id, role, ...changeDataUserDefaultProps } = changeDataUser;

    // let dataToUpdate = {
    //   ...changeDataUserDefaultProps,
    //   roleId: userData.roleId,
    // };
    //
    // if (user.roleId === 4) {
    //   const roleUser = await this.roleService.findOne({
    //     where: { name: role },
    //   });
    //
    //   dataToUpdate = { ...dataToUpdate, roleId: roleUser.id };
    // }

    await this.userModel.update(
      { ...changeDataUser },
      {
        where: {
          id: changeDataUser.id,
        },
      },
    );

    // if (user.roleId === 4 && dataToUpdate.roleId === 3) {
    //   await this.doctorService.create(id);
    // }

    return {
      status: 'success',
      message: 'Изменения сохранены',
    };
  }

  async changeRole(
    userIdReq: string,
    changeRoleUserDto: ChangeRoleUserDto,
  ): Promise<any> {
    const userReq = await this.findOne({
      where: { id: userIdReq },
    });

    if (userReq.roleId !== 4) {
      throw new ForbiddenException();
    }

    const patchUser = await this.findOne({
      where: { id: String(changeRoleUserDto.id) },
    });

    const roleToPatch = await this.roleService.findOne({
      where: { name: changeRoleUserDto.role },
    });

    if (patchUser.roleId === 3 && roleToPatch.id !== 3) {
      const doctor = await this.doctorService.findOne({
        where: { userId: patchUser.id },
      });

      await this.doctorService.remove({ where: { id: doctor.id } });
    }

    await this.userModel.update(
      { roleId: roleToPatch.id },
      {
        where: {
          id: patchUser.id,
        },
      },
    );

    if (roleToPatch.id === 3) {
      await this.doctorService.create(patchUser.id);
    }

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
