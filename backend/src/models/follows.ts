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
    tableName: "follows",
})
class Follows extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    follower!: number;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    following!: number;
}

export default Follows;
