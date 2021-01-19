import {Table, 
  Column, 
  Model, 
  AutoIncrement, 
  AllowNull, 
  PrimaryKey, 
  BelongsTo, 
  ForeignKey, 
  HasMany, 
  BelongsToMany
} from 'sequelize-typescript';
import User from "./user"
import Likes from './likes'
import Hashtag from './hashtag'
import HasHashtag from './hasHashtag'

@Table({
    timestamps: true,
    tableName: 'tweets',
  })
  
export default class Tweet extends Model {

  @Column
  @PrimaryKey
  @AutoIncrement
  id!: number;
  
  // one-to-many relation between user and tweets
  @Column
  @ForeignKey(() => User)
  userID!: number;

  @BelongsTo(() => User)
  user!: User;

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

  // many-to-many relation between user and tweet through likes
  @BelongsToMany(() => User, () => Likes, 'userId', 'tweetId')
  likes?: User[];

  // many-to-many relation between hastag and tweet through hasHashtag
  @BelongsToMany(() => Hashtag, () => HasHashtag, 'hashtag', 'tweetId')
  hashtags?: Hashtag[];
}