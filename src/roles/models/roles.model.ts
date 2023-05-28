import { Table, Model, Column, BelongsTo, ForeignKey } from 'sequelize-typescript';

import { Roles } from '../enums/roles.enums';
import { User } from '../../users/models/users.model';

@Table
export class Role extends Model {
  @Column
  name: Roles;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
