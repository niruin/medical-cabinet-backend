import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Patient } from './models/patients.model';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient) protected patientModel: typeof Patient) {}

  async findAll(userId: string): Promise<any> {
    const list = await this.patientModel.findAll({ raw: true });

    return {
      status: 'success',
      message: 'Список пацентов получен',
      data: list,
    };
  }

  async findOne(userId: number): Promise<any> {
    return await this.patientModel.findOne({ where: { userId: userId } });
  }

  async remove(userId: number): Promise<any> {
    return await this.patientModel.destroy({ where: { userId: userId } });
  }

  async create(userId: number): Promise<any> {
    const patient = new Patient();

    patient.userId = userId;

    const newPatient = await patient.save();

    return newPatient;
  }
}
