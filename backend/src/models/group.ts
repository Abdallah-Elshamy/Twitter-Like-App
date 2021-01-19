import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';

import Permission from './permission';
import HasPermission from './hasPermission';

@Table({
  timestamps: true,
  tableName: 'groups',
})
export default class Group extends Model {
  @Column
  @PrimaryKey
  name!: string;

  @BelongsToMany(() => Permission, () => HasPermission)
  permissions?: Permission[];
}
