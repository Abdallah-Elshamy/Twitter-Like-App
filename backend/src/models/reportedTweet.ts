import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
    AllowNull
} from "sequelize-typescript";
import User from "./user";
import Tweet from "./tweet"

@Table({
    tableName: "reportedTweets",
})
class ReportedTweet extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    reporterId!: number;

    @PrimaryKey
    @ForeignKey(() => Tweet)
    @Column(DataType.INTEGER)
    tweetId!: number;

    @AllowNull(true)
    @Column(DataType.TEXT)
    bio?: string;
}

export default ReportedTweet;
