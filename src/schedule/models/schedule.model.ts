import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Patient } from '../../patients/models/patients.model';
import { Doctor } from '../../doctors/models/doctors.model';

@Table
export class Schedule extends Model {
  @Column diagnosis: string;

  @Column comments: string;

  @Column startDate: Date;

  @Column endDate: Date;

  @ForeignKey(() => Patient)
  @Column
  patientId: number;

  @ForeignKey(() => Doctor)
  @Column
  doctorId: number;

  @BelongsTo(() => Patient)
  patient: Patient;

  @BelongsTo(() => Doctor)
  doctor: Doctor;
}
