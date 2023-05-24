import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Patient } from '../../patients/models/patients.model';
import { Doctor } from '../../doctors/models/doctors.model';

@Table
export class Schedule extends Model {
  @Column diagnosis: string;

  @Column comments: string;

  @Column date: string;

  @ForeignKey(() => Patient)
  @Column
  patientId: number;

  @BelongsTo(() => Patient)
  patient: Patient;

  @ForeignKey(() => Doctor)
  @Column
  doctorId: number;

  @BelongsTo(() => Doctor)
  doctor: Doctor;
}
