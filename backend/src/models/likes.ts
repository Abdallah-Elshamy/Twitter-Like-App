import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
} from "sequelize-typescript";
import User from "./user";
import Tweet from "./tweet";

@Table({
    tableName: "likes",
})
class Likes extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @PrimaryKey
    @ForeignKey(() => Tweet)
    @Column(DataType.INTEGER)
    tweetId!: number;
}

export default Likes;
