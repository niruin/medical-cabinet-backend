import { Table, Model, Column } from 'sequelize-typescript';

import { Roles } from '../enums/roles.enums';

@Table
export class Role extends Model {
  @Column
  name: Roles;
}
