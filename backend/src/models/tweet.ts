import {Table, 
  Column, 
  Model, 
  AutoIncrement, 
  AllowNull, 
  PrimaryKey, 
  BelongsTo, 
  ForeignKey, 
  HasMany, 
  HasOne,
  BelongsToMany,
  DataType
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

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;
  
  // one-to-many relation between user and tweets
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
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

  // one-to-many relation between tweets representing replies 
  //and one to many relation to the thread tweet
  @HasMany(() => Tweet, 'repliedToTweet')
  replies?: Tweet[];

  @BelongsTo(() => Tweet, 'repliedToTweet')
  repliedTo?: Tweet;

  @HasMany(() => Tweet, 'threadTweet')
  threadChildren?: Tweet[];

  @BelongsTo(() => Tweet, 'threadTweet')
  thread?: Tweet;

  @ForeignKey(() => Tweet)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  repliedToTweet?: number;

  @ForeignKey(() => Tweet)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  threadTweet?: number;
}