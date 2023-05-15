import { Table, Model, Column } from 'sequelize-typescript';

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
}
