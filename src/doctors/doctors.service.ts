import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Doctor } from './models/doctors.model';
import { User } from '../users/models/users.model';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor) protected doctorModel: typeof Doctor) {}

  async findAll(): Promise<any> {
    const list = await this.doctorModel
      .findAll({
        raw: true,
        include: [
          {
            model: User,
          },
        ],
      })
      .then((data) => {
        return data.map((item) => ({
          id: item.id,
          firstName: item['user.firstName'],
          middleName: item['user.middleName'],
          lastName: item['user.lastName'],
        }));
      });

    return {
      status: 'success',
      message: 'Список врачей получен',
      data: list,
    };
  }

  async findOne(options): Promise<any> {
    return await this.doctorModel.findOne(options);
  }

  async create(userId: number): Promise<any> {
    const doctor = new Doctor();

    doctor.userId = userId;

    const newDoctor = await doctor.save();

    return {
      status: 'success',
      message: 'Доктор добавлен',
      data: newDoctor,
    };
  }

  async remove(userId: number): Promise<void> {
    await this.doctorModel.destroy({ where: { userId: userId } });
  }
}
