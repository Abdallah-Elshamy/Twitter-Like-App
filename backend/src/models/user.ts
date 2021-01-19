import {Table, Column, Model, AutoIncrement, AllowNull, PrimaryKey, HasMany} from 'sequelize-typescript';
import Tweet from "./tweet"
@Table({
    timestamps: true,
    tableName: 'users',
  })
  
export default class User extends Model {

  @Column
  @PrimaryKey
  @AutoIncrement
  id!: number;

  @Column
  @AllowNull(false)
  name!: string;

  @Column
  @AllowNull(false)
  userName!: string;

  @Column
  @AllowNull(false)
  mail!: string;

  @Column
  image?: string;

  @Column
  bio?: string;

  @Column
  coverImage?: string;

  // one-to-many relation between user and tweets
  @HasMany(() => Tweet)
  tweets!: Tweet[];
}