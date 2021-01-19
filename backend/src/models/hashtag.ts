import {Table, Column, Model, PrimaryKey} from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'hashtags',
  })
  
export default class Hashtag extends Model {

  @Column
  @PrimaryKey
  word!: string;
}