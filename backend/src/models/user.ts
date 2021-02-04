import {
    Table,
    Column,
    Model,
    AutoIncrement,
    AllowNull,
    PrimaryKey,
    HasMany,
    DataType,
    BelongsToMany,
    Unique,
} from "sequelize-typescript";
import Follows from "./follows";
import Tweet from "./tweet";
import Group from "./group";
import UserBelongsToGroup from "./userBelongsToGroup";
import Likes from "./likes";

@Table({
    tableName: "users",
})
class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    userName!: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    hashedPassword!: string;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    birthDate!: Date;
    
    @AllowNull(true)
    @Column(DataType.STRING)
    imageURL?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    bio?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    coverImageURL?: string;

    // one-to-many relation between user and tweets
    @HasMany(() => Tweet, "userId")
    tweets?: Tweet[];

    // many-to-many  relation between user and user
    @BelongsToMany(() => User, () => Follows, "follower", "following")
    following?: User[];

    @BelongsToMany(() => User, () => Follows, "following", "follower")
    followers?: User[];

    // many-to-many relation between user and group
    @BelongsToMany(() => Group, () => UserBelongsToGroup, "userId", "groupName")
    groups?: Group[];

    // many-to-many relation between user and tweet through likes
    @BelongsToMany(() => Tweet, () => Likes, "userId", "tweetId")
    likes?: Tweet[];
}

export default User;
