import {
    Table,
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
    DataType,
} from "sequelize-typescript";
import User from "./user";
import Likes from "./likes";
import Hashtag from "./hashtag";
import HasHashtag from "./hasHashtag";

@Table({
    timestamps: true,
    tableName: "tweets",
})
class Tweet extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    // one-to-many relation between user and tweets
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId!: number;

    @BelongsTo(() => User, "userId")
    user!: User;

    @AllowNull(false)
    @Column(DataType.STRING)
    text!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    media?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    state?: string;

    // one-to-many relation between original tweet and sub tweets
    @ForeignKey(() => Tweet)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    originalTweetId!: number;

    @BelongsTo(() => Tweet, "originalTweetId")
    originalTweet!: Tweet;

    @HasMany(() => Tweet, "originalTweetId")
    subTweets!: Tweet[];

    // many-to-many relation between user and tweet through likes
    @BelongsToMany(() => User, () => Likes, "tweetId", "userId")
    likes?: User[];

    // many-to-many relation between hastag and tweet through hasHashtag
    @BelongsToMany(() => Hashtag, () => HasHashtag, "tweetId", "hashtag")
    hashtags?: Hashtag[];

    // one-to-many relation between tweets representing replies
    //and one to many relation to the thread tweet
    @HasMany(() => Tweet, "repliedToTweet")
    replies?: Tweet[];

    @BelongsTo(() => Tweet, "repliedToTweet")
    repliedTo?: Tweet;

    @HasMany(() => Tweet, "threadTweet")
    threadChildren?: Tweet[];

    @BelongsTo(() => Tweet, "threadTweet")
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

export default Tweet;