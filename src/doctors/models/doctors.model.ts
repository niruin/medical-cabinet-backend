import { Table, Model, Column, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';

import { User } from '../../users/models/users.model';
import { Schedule } from '../../schedule/models/schedule.model';

@Table
export class Doctor extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Schedule)
  schedule: Schedule[];
}
