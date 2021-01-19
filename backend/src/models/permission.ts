import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';

import HasPermission from './hasPermission';
import Group from './group';

@Table({
  timestamps: true,
  tableName: 'permissions',
})
export default class Permission extends Model {
  @Column
  @PrimaryKey
  name!: string;

  @BelongsToMany(() => Group, () => HasPermission)
  groups?: Group[];
}
