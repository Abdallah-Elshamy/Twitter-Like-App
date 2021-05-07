import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
} from "sequelize-typescript";
import User from "./user";

@Table({
    tableName: "mutedUsers",
})
class MutedUser extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    muterId!: number;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    mutedId!: number;
}

export default MutedUser;
