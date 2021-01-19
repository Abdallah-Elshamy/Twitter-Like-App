import {Table, Column, Model, PrimaryKey} from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'permissions',
  })
  
export default class Permission extends Model {

  @Column
  @PrimaryKey
  name!: string;
}