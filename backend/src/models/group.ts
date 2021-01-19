import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';

import Permission from './permission';
import HasPermission from './hasPermission';
import User from './user';
import UserBelongsToGroup from './userBelongsToGroup';

@Table({
  timestamps: true,
  tableName: 'groups',
})
export default class Group extends Model {
  @Column
  @PrimaryKey
  name!: string;

  // many-to-many relation between group and permission
  @BelongsToMany(() => Permission, () => HasPermission)
  permissions?: Permission[];

  // many-to-many relation between group and user
  @BelongsToMany(() => User, () => UserBelongsToGroup)
  users?: User[];
}
