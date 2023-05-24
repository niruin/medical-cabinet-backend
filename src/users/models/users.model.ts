import { Table, Model, Column, HasOne } from 'sequelize-typescript';

import { Doctor } from '../../doctors/models/doctors.model';
import { Patient } from '../../patients/models/patients.model';
import { Role } from '../../roles/models/roles.model';

@Table
export class User extends Model {
  @Column
  email: string;

  @Column
  password: string;

  @Column
  firstName: string;

  @Column
  middleName: string;

  @Column
  lastName: string;

  @Column
  birthDate: string;

  @Column
  height: string;

  @Column
  weight: string;

  @Column
  gender: string;

  @Column
  roleId: number;

  @HasOne(() => Doctor)
  doctor: Doctor;

  @HasOne(() => Patient)
  patient: Patient;

  @HasOne(() => Role)
  role: Role;
}
