import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
    AllowNull,
} from "sequelize-typescript";
import User from "./user";

@Table({
    tableName: "reportedUsers",
})
class ReportedUser extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    reporterId!: number;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    reportedId!: number;

    @AllowNull(true)
    @Column(DataType.TEXT)
    reason?: string;
}

export default ReportedUser;
