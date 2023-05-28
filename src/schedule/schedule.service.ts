import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Schedule } from './models/schedule.model';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UsersService } from '../users/users.service';
import { ChangeScheduleDto } from './dto/change-schedule.dto';
import { User } from '../users/models/users.model';
import { PatientsService } from '../patients/patients.service';
import { Doctor } from '../doctors/models/doctors.model';
import { Patient } from '../patients/models/patients.model';
import { Roles } from '../roles/enums/roles.enums';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) protected scheduleModel: typeof Schedule,
    private readonly userService: UsersService,
    private readonly patientService: PatientsService,
    private readonly doctorService: DoctorsService,
  ) {}

  async create(reqUserId: number, createScheduleDto: CreateScheduleDto): Promise<any> {
    const { startDate, endDate, userId, doctorId } = createScheduleDto;

    const isHasPatient = await this.patientService.findOne(userId);
    if (!isHasPatient) {
      await this.userService.changeRole({
        id: reqUserId,
        role: Roles.PATIENT,
      });
    }

    const patient = await this.patientService.findOne(reqUserId);

    const schedule = new Schedule();
    schedule.doctorId = doctorId;
    schedule.patientId = patient.dataValues.id;
    schedule.startDate = startDate;
    schedule.endDate = endDate;

    const newSchedule = await schedule.save();
    console.log('newSchedule.id ', newSchedule.id);

    const scheduleWithData = await this.scheduleModel
      .findOne({
        where: { id: newSchedule.id },
        attributes: [
          `id`,
          `diagnosis`,
          `comments`,
          `startDate`,
          `endDate`,
          `patientId`,
          `doctorId`,
        ],
        raw: true,
        include: [
          {
            model: Doctor,
            where: {
              id: doctorId,
            },
            attributes: [],
            include: [
              {
                model: User,
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
          {
            model: Patient,
            attributes: [],
            include: [
              {
                model: User,
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
        ],
      })
      .then((item) => {
        return {
          event_id: item.id,
          diagnosis: item.diagnosis,
          comments: item.comments,
          startDate: item.startDate,
          endDate: item.endDate,
          title: `${item['patient.user.lastName']} ${item['patient.user.firstName']}`,
          doctor: {
            firstName: item['doctor.user.firstName'],
            middleName: item['doctor.user.middleName'],
            lastName: item['doctor.user.lastName'],
          },
          patient: {
            firstName: item['patient.user.firstName'],
            middleName: item['patient.user.middleName'],
            lastName: item['patient.user.lastName'],
          },
        };
      });

    return {
      status: 'success',
      message: 'Запись на прием создана',
      data: scheduleWithData,
    };
  }

  async update(reqUserId: string, changeScheduleDto: ChangeScheduleDto): Promise<any> {
    const user = await this.userService.findOne({ where: { id: reqUserId } });
    const { id, ...rest } = changeScheduleDto;
    if (user.roleId !== 3) {
      throw new ForbiddenException();
    }

    await this.scheduleModel.update(
      { ...rest },
      {
        where: {
          id,
        },
      },
    );

    return {
      status: 'success',
      message: 'Заявка успешно изменена',
    };
  }

  async remove(options): Promise<any> {
    await this.scheduleModel.destroy(options);

    return {
      status: 'success',
      message: 'Заявка успешно удалена',
    };
  }

  async list(reqUserId: string, doctorId: string): Promise<any> {
    const user = await this.doctorService.findOne({ where: { id: doctorId } });

    // if (user.roleId !== 3) {
    //   throw new ForbiddenException();
    // }

    const { userId } = user;

    const list = await this.scheduleModel
      .findAll({
        attributes: [
          `id`,
          `diagnosis`,
          `comments`,
          `startDate`,
          `endDate`,
          `patientId`,
          `doctorId`,
        ],
        raw: true,
        include: [
          {
            model: Doctor,
            where: {
              userId,
            },
            attributes: [],
            include: [
              {
                model: User,
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
          {
            model: Patient,
            attributes: [],
            include: [
              {
                model: User,
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
        ],
      })
      .then((data) => {
        return data.map((item) => ({
          event_id: item.id,
          diagnosis: item.diagnosis,
          comments: item.comments,
          startDate: item.startDate,
          endDate: item.endDate,
          title: `${item['patient.user.lastName']} ${item['patient.user.firstName']}`,
          doctor: {
            firstName: item['doctor.user.firstName'],
            middleName: item['doctor.user.middleName'],
            lastName: item['doctor.user.lastName'],
          },
          patient: {
            firstName: item['patient.user.firstName'],
            middleName: item['patient.user.middleName'],
            lastName: item['patient.user.lastName'],
          },
        }));
      });

    return {
      status: 'success',
      message: 'Список получен',
      data: list,
    };
  }
}
