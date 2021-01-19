import {Table, Column, Model, PrimaryKey} from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'groups',
  })
  
export default class Group extends Model {

  @Column
  @PrimaryKey
  name!: string;
}