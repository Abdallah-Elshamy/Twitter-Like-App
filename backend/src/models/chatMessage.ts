import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
    AllowNull,
    AutoIncrement,
} from "sequelize-typescript";
import User from "./user";

@Table({
    tableName: "chatMessage",
})
class ChatMessage extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    from!: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    to!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    message!: string;
}

export default ChatMessage;
