import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
} from 'sequelize-typescript';
import User from './user';
import Group from './group';

@Table({
    tableName: 'userBelongsToGroup',
})
class UserBelongsToGroup extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @PrimaryKey
    @ForeignKey(() => Group)
    @Column(DataType.INTEGER)
    groupName!: string;
}


export default UserBelongsToGroup;