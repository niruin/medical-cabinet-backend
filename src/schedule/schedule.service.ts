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
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) protected scheduleModel: typeof Schedule,
    private readonly userService: UsersService,
    private readonly patientService: PatientsService,
    private readonly doctorService: DoctorsService,
  ) {}

  async create(
    userId: number,
    createScheduleDto: CreateScheduleDto,
  ): Promise<any> {
    const { date, doctorId } = createScheduleDto;

    let patient = await this.patientService.findOne(userId);
    if (!patient) {
      patient = await this.patientService.create(userId);
    }

    const schedule = new Schedule();
    schedule.doctorId = doctorId;
    schedule.patientId = patient.dataValues.id;
    schedule.date = date;

    await schedule.save();

    return {
      status: 'success',
      message: 'Запись на прием создана',
    };
  }

  async update(
    reqUserId: string,
    changeScheduleDto: ChangeScheduleDto,
  ): Promise<any> {
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

  async patientList(reqUserId: string): Promise<any> {
    const list = await this.scheduleModel.findAll({
      attributes: [
        `id`,
        `patientId`,
        `doctorId`,
        `diagnosis`,
        `comments`,
        `date`,
      ],
      raw: true,
      where: { patientId: reqUserId },
    });

    return {
      status: 'success',
      message: 'Заявка успешно удалена',
      data: list,
    };
  }

  async doctorList(reqUserId: string): Promise<any> {
    // const user = await this.userService.findOne({ where: { id: reqUserId } });

    // if (user.roleId !== 3) {
    //   throw new ForbiddenException();
    // }

    const list = await this.scheduleModel
      .findAll({
        attributes: [`id`, `diagnosis`, `comments`, `date`],
        raw: true,
        include: [
          {
            model: Doctor,
            where: {
              userId: reqUserId,
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
          start: item.date,
          title: item['doctor.user.lastName'],
          patient: {
            firstName: item['doctor.user.firstName'],
            middleName: item['doctor.user.middleName'],
            lastName: item['doctor.user.lastName'],
          },
          doctor: {
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
