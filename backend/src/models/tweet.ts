import {Table, Column, Model, AutoIncrement, AllowNull, PrimaryKey, BelongsTo, ForeignKey, HasMany} from 'sequelize-typescript';
import User from "./user"

@Table({
    timestamps: true,
    tableName: 'tweets',
  })
  
export default class Tweet extends Model {

  @Column
  @PrimaryKey
  @AutoIncrement
  id!: number;
    
  @Column
  @ForeignKey(() => User)
  userID!: number;

  @Column
  @AllowNull(false)
  text!: string;

  @Column
  media?: string;

  @Column
  @AllowNull(false)
  state?: string;

  // one-to-many relation between original tweet and sub tweets
  @Column
  @ForeignKey(() => Tweet)
  originalTweetID!: number;

  @BelongsTo(() => Tweet)
  originalTweet!: Tweet;

  @HasMany(() => Tweet)
  subTweets!: Tweet[];
}